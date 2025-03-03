import Database from 'better-sqlite3';

const db = new Database('database.sqlite');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        admin BOOLEAN
    )
`)
db.exec(`
    CREATE TABLE IF NOT EXISTS student(
        student_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        student_class TEXT,
        enrolled BOOLEAN DEFAULT 0,
        parent_contact TEXT,
        amount_quoted INTEGER DEFAULT 0,
        amount_recieved INTEGER DEFAULT 0,
        recieved_by TEXT
 )`)
export default db