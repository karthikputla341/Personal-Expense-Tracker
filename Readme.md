

Node.js API for User Registration, Login, and Transaction Management
This is a Node.js-based RESTful API for managing user registration, login, and transactions using SQLite3 as the database. It includes user authentication with JWT tokens, secure password storage using bcrypt, and various CRUD operations for managing transactions.

Features
User Registration: Register new users with a username, email, and password.
User Login: Authenticate users using email and password, issuing a JWT token for further requests.
JWT Authentication: Secure API endpoints using JWT for authorized access.
Transaction Management: Add, update, delete, and view user-specific transactions.
Transaction Summary: Get a summary of total income and expenses for a user.
Pagination: Retrieve transactions with pagination support.
Technologies Used
Node.js: JavaScript runtime for building the server.
Express: Web framework for Node.js.
SQLite3: Database for storing user and transaction data.
bcrypt: For secure password hashing.
jsonwebtoken: For generating and verifying JWT tokens.
Prerequisites
Node.js (version >= 14)
npm (version >= 6)
Getting Started
Clone the repository:

bash
Copy code
git clone <repository-url>
cd <repository-folder>
Install dependencies:

bash
Copy code
npm install
Create a SQLite database:

bash
Copy code
touch database.db
Run the application:

bash
Copy code
node index.js
The server will start on http://localhost:3000.

API Endpoints
Authentication
Register User: POST /api/register

Body:
json
Copy code
{
  "username": "user1",
  "email": "user@example.com",
  "password": "password123"
}
Response:
json
Copy code
{
  "message": "User registered successfully.",
  "userId": 1
}
Login User: POST /api/login

Body:
json
Copy code
{
  "email": "user@example.com",
  "password": "password123"
}
Response:
json
Copy code
{
  "message": "Login successful",
  "token": "jwt_token"
}
Transactions (Requires Authentication)
Add Transaction: POST /api/transactions

Headers: { "Authorization": "Bearer jwt_token" }
Body:
json
Copy code
{
  "type": "income",
  "category": "salary",
  "amount": 5000,
  "date": "2024-10-23",
  "description": "Monthly salary"
}
Response:
json
Copy code
{
  "message": "Transaction added successfully.",
  "transactionId": 1
}
Get All Transactions: GET /api/transactions

Response:
json
Copy code
[
  {
    "id": 1,
    "userId": 1,
    "type": "income",
    "category": "salary",
    "amount": 5000,
    "date": "2024-10-23",
    "description": "Monthly salary"
  },
  ...
]
Get User Transactions: GET /api/transactions-user

Headers: { "Authorization": "Bearer jwt_token" }
Response:
json
Copy code
{
  "transactions": [
    {
      "id": 1,
      "type": "income",
      "category": "salary",
      "amount": 5000,
      "date": "2024-10-23",
      "description": "Monthly salary"
    },
    ...
  ]
}
Get Transaction by ID: GET /api/transactions/:id

Response:
json
Copy code
{
  "transaction": {
    "id": 1,
    "type": "income",
    "category": "salary",
    "amount": 5000,
    "date": "2024-10-23",
    "description": "Monthly salary"
  }
}
Update Transaction: PUT /api/transactions/:id

Headers: { "Authorization": "Bearer jwt_token" }
Body:
json
Copy code
{
  "type": "expense",
  "category": "groceries",
  "amount": 100,
  "date": "2024-10-24",
  "description": "Weekly groceries"
}
Response:
json
Copy code
{
  "message": "Transaction updated successfully."
}
Delete Transaction: DELETE /api/transactions/:id

Headers: { "Authorization": "Bearer jwt_token" }
Response:
json
Copy code
{
  "message": "Transaction deleted successfully."
}
Summary and Pagination
Get User Transaction Summary: GET /api/summary-user

Headers: { "Authorization": "Bearer jwt_token" }
Query Parameters (optional): ?startDate=2024-01-01&endDate=2024-12-31&category=salary
Response:
json
Copy code
{
  "totalIncome": 5000,
  "totalExpense": 1000,
  "balance": 4000
}
Get Transactions with Pagination: GET /api/transactions-pagination

Query Parameters: ?page=1&limit=10
Response:
json
Copy code
{
  "transactions": [...],
  "currentPage": 1,
  "totalPages": 5,
  "totalTransactions": 50
}
Database Structure
users

id: Primary key, auto-incremented.
username: User's username.
email: User's unique email.
password: Hashed password.
transactions

id: Primary key, auto-incremented.
userId: Foreign key, references users(id).
type: Type of transaction (income or expense).
category: Transaction category.
amount: Amount of the transaction.
date: Date of the transaction.
description: Description of the transaction.
Security Considerations
JWT Authentication: Secures endpoints and ensures only authenticated users can access specific routes.
Password Hashing: Uses bcrypt to hash passwords before storing them in the database.
SQL Injection Prevention: Uses parameterized queries to avoid SQL injection attacks.
License
This project is licensed under the MIT License.

Contact
For any queries, contact [your-email@example.com].

Replace <repository-url> and [your-email@example.com] with your actual repository URL and contact email. This README.md provides clear documentation of the project, making it easy for others to understand and use.






You said:
in this project i have done register login then i get token to create restful method on data base and also summary for thing
ChatGPT said:
ChatGPT
Memory updated
Here’s a more tailored README.md based on your project's focus:

Node.js Authentication and Transaction Management API
This is a Node.js-based RESTful API project for managing user registration, login, and transactions using SQLite3. It features user authentication with JWT tokens, secure password storage using bcrypt, and allows users to perform CRUD operations on transactions with a summary feature.

Features
User Registration & Login:
Register new users with a username, email, and password.
Authenticate users using email and password, issuing a JWT token for further requests.
JWT Authentication: Secure API endpoints using JWT for authorized access.
CRUD Operations on Transactions: Create, read, update, and delete transactions for logged-in users.
Transaction Summary: Get a summary of income, expenses, and balance.
Technologies Used
Node.js: JavaScript runtime for server-side programming.
Express: Web framework for Node.js.
SQLite3: Lightweight database for user and transaction data.
bcrypt: For hashing passwords securely.
jsonwebtoken: For generating and verifying JWT tokens.
Getting Started
Clone the Repository:

bash
Copy code
git clone <repository-url>
cd <repository-folder>
Install Dependencies:

bash
Copy code
npm install
Create SQLite Database:

bash
Copy code
touch database.db
Start the Server:

bash
Copy code
node index.js
The server will run at http://localhost:3000.

API Endpoints
User Authentication
Register: POST /api/register

Request Body:
json
Copy code
{
  "username": "exampleUser",
  "email": "user@example.com",
  "password": "password123"
}
Response:
json
Copy code
{
  "message": "User registered successfully.",
  "userId": 1
}
Login: POST /api/login

Request Body:
json
Copy code
{
  "email": "user@example.com",
  "password": "password123"
}
Response:
json
Copy code
{
  "message": "Login successful",
  "token": "jwt_token"
}
Transaction Management (Authenticated)
Create Transaction: POST /api/transactions

Headers: { "Authorization": "Bearer jwt_token" }
Request Body:
json
Copy code
{
  "type": "income",
  "category": "salary",
  "amount": 1000,
  "date": "2024-10-23",
  "description": "Monthly income"
}
Response:
json
Copy code
{
  "message": "Transaction added successfully.",
  "transactionId": 1
}
Get User Transactions: GET /api/transactions-user

Headers: { "Authorization": "Bearer jwt_token" }
Response:
json
Copy code
{
  "transactions": [
    {
      "id": 1,
      "type": "income",
      "category": "salary",
      "amount": 1000,
      "date": "2024-10-23",
      "description": "Monthly income"
    }
  ]
}
Get Transaction Summary: GET /api/summary-user

Headers: { "Authorization": "Bearer jwt_token" }
Query Parameters: ?startDate=2024-01-01&endDate=2024-12-31
Response:
json
Copy code
{
  "totalIncome": 5000,
  "totalExpense": 1500,
  "balance": 3500
}
Additional Features
Pagination: Retrieve transactions in pages for easier data handling using GET /api/transactions-pagination?page=1&limit=10.
Update Transaction: Update specific transaction details with PUT /api/transactions/:id.
Delete Transaction: Remove a transaction with DELETE /api/transactions/:id.
Security Considerations
JWT for Authorization: Ensures that only authenticated users can access or modify their transactions.
Secure Password Storage: Passwords are hashed using bcrypt before storing in the database.
Input Validation: Ensures proper data handling for registration, login, and transaction management.
Running the Project
Make sure to configure the SECRET_KEY for JWT in the project to ensure secure token generation and validation. Adjust database configuration if needed.
