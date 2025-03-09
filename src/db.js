import sqlite3 from 'sqlite3';

// Open database connection
const db = new sqlite3.Database('database.sqlite',sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to the SQLite database.");

        // Run table creation queries after connection is established
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT,
                admin INTEGER DEFAULT 0
            )
        `, (err) => {
            if (err) console.error("Error creating 'users' table:", err.message);
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS student(
                student_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                student_class TEXT,
                enrolled INTEGER DEFAULT 0,
                parent_contact TEXT,
                amount_quoted INTEGER DEFAULT 0,
                amount_recieved INTEGER DEFAULT 0,
                recieved_by TEXT,
                school TEXT,    
                enrolled_subjects TEXT
            )
        `, (err) => {
            if (err) console.error("Error creating 'student' table:", err.message);
        });
    }
});

export default db;
