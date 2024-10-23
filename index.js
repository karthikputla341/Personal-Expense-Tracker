const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

const SECRET_KEY = 'secret_key'; 


// Creating users and transactions tables
const db = new sqlite3.Database('./expense.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )`
        );
        db.run(
            `CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                type TEXT NOT NULL,
                category TEXT,
                amount REAL NOT NULL,
                date TEXT NOT NULL,
                description TEXT,
                FOREIGN KEY (userId) REFERENCES users(id)

            )`
        );
        db.run(
            `CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT ,
            name TEXT NOT NULL,
            type TEXT NOT NULL
            )`
        );
    }
});


// Middleware to authenticate users
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token missing' });
    }else{
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err){ 
                return res.status(403).json({ error: 'Invalid token' });
            }else{
                req.user = user;
                next();
            }
        });
    }
};


// User registration route
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store user in the database
        const sql = `INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${hashedPassword}')`;
        db.run(sql, function (err){
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(400).json({ error: 'Email already in use.' });
                }
                return res.status(500).json({ error: 'Internal server error.' });
            }
            res.status(201).json({ message: 'User registered successfully.', userId: this.lastID });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// User login route with token generation
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const sql = `SELECT * FROM users WHERE email = '${email}'`;
    
    db.get(sql,  async (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error.' });
        }
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        try {
            // Compare the provided password with the hashed password in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ error: 'Invalid credentials.' });
            }

            // Generate a JWT token if the credentials are valid
            const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY);
            res.status(200).json({ message: 'Login successful', token });
        } catch (compareError) {
            console.error(compareError);
            return res.status(500).json({ error: 'Error comparing passwords.' });
        }
    });
});


// Added a new transaction (authenticated) with login user 
app.post('/api/transactions', authenticateToken, (req, res) => {
    const { type, category, amount, date, description } = req.body;
    const userId = req.user.userId;

    if (!type || !category || !amount || !date || !description) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const sql = `INSERT INTO transactions (userId, type, category, amount, date, description) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [userId, type, category, amount, date, description], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to add transaction.' });
        }
        res.status(201).json({ message: 'Transaction added successfully.', transactionId: this.lastID });
    });
});


//get all transactions of users
app.get('/api/transactions', (req, res) => {
    const sql = `SELECT * FROM transactions`;
    
    db.all(sql, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve transactions.' });
        }
        res.status(200).json(rows);
    });
});


// Get all transactions done by the specific user with token
app.get('/api/transactions-user', authenticateToken, (req, res) => {
    const userId = req.user.userId;

    const sql = `SELECT * FROM transactions WHERE userId = '${userId}'`;
    db.all(sql, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve transactions.' });
        }
        res.json({ transactions: rows });
    });
});


// Get a specific transaction by transactionID 
app.get('/api/transactions/:id',  (req, res) => {
    const { id } = req.params;

    const sql = `SELECT * FROM transactions WHERE id = '${id}'`;
    db.get(sql, (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve transaction.' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Transaction not found.' });
        }
        res.json({ transaction: row });
    });
});


// Update a specific transaction by its ID 
app.put('/api/transactions/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { type, category, amount, date, description } = req.body;
    const userId = req.user.userId;

    const sql = `UPDATE transactions SET type = '${type}', category = '${category}', amount = '${amount}', date = '${date}', description = '${description}' WHERE id = '${id}' AND userId = '${userId}'`;
    
    db.run(sql, function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to update transaction.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Transaction not found or you are not authorized to update this transaction.' });
        }
        res.json({ message: 'Transaction updated successfully.' });
    });
});



// Delete a specific transaction by ID for the authenticated user
app.delete('/api/transactions/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    const sql = `DELETE FROM transactions WHERE id = ? AND userId = ?`;
    db.run(sql, [id, userId], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete transaction.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Transaction not found.' });
        }
        res.json({ message: 'Transaction deleted successfully.' });
    });
});

app.get('/api/summary-user', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const { startDate, endDate, category } = req.query;

    // Basic SQL to retrieve total income and total expenses
    let sql = `SELECT 
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpense
               FROM transactions
               WHERE userId = '${userId}'`;

    const params = [userId];

    // Add date range if provided
    if (startDate && endDate) {
        sql += ` AND date BETWEEN '${startDate}' AND '${endDate}'`;
        //params.push(startDate, endDate);
    }

    // Add category if provided
    if (category) {
        sql += ` AND category = '${category}'`;
        //params.push(category);
    }

    db.get(sql, (err, row) => {
        if (err) return res.status(500).json({ error: 'Failed to retrieve summary.' });

        const totalIncome = row.totalIncome || 0;
        const totalExpense = row.totalExpense || 0;
        const balance = totalIncome - totalExpense;

        res.json({ totalIncome, totalExpense, balance });
    });
});


app.get('/api/transactions-pagination', (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default values for page and limit
    const offset = (page - 1) * limit;

    const sql = `SELECT * FROM transactions LIMIT ? OFFSET ?`;
    const params = [Number(limit), Number(offset)];

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve transactions.' });
        }

        //  total count of transactions for pagination metadata
        db.get(`SELECT COUNT(*) AS total FROM transactions`, (err, countResult) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to count transactions.' });
            }

            const totalTransactions = countResult.total;
            const totalPages = Math.ceil(totalTransactions / limit);

            res.json({
                transactions: rows,
                currentPage: Number(page),
                totalPages,
                totalTransactions
            });
        });
    });
});



// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
