

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


NOTE: Additional features Implement basic user authentication and link transactions to specific users.
Add pagination to the GET /transactions endpoint to handle large volumes of data.
Create an endpoint for generating reports, such as monthly spending by category.(summary) also added.
