# Authentication Service

This is a simple authentication service built using **Node.js**, **Express.js**, and **SQLite3**. The service provides authentication functionality, allowing users to sign up, log in, and authenticate via JWT tokens.

### Features
- User sign-up
- User login
- JWT-based authentication
- Simple and easy to use with any frontend

## Technologies Used
- **Node.js**: JavaScript runtime for building the server-side logic
- **Express.js**: Web framework for Node.js
- **SQLite3**: Database used for storing user credentials and related data
- **JWT (JSON Web Token)**: Authentication mechanism using tokens

## Setup and Installation

### Prerequisites
- Node.js (>= 12.0.0)
- SQLite3

### Steps to Run

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd <your-repository-directory>
2. **Install dependencies**:
   ```bash
    npm install
3. **Database Setup**:
   The SQLite3 database is automatically created when you first run the service. However, you can modify the database schema if needed in db.js
4. **Configure the Port**:
   You can change the port number for the backend service by editing the PORT variable in the .env file or directly in service.js:
   ```js
   const PORT = process.env.PORT || 3000
5. **Run the Application**:
 Start the server by running:
 ```bash
npm run dev
