const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const db = new Database(process.env.DB_PATH || './stoksepeti.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity REAL NOT NULL,
    unit TEXT NOT NULL,
    expiry_date TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

module.exports = db;
