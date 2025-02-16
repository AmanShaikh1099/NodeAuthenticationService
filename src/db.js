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
export default db