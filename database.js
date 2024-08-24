const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Store the database in a file
const dbPath = path.resolve(__dirname, 'blog.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(
            `CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL
            )`,
            (err) => {
                if (err) {
                    console.error('Error creating table', err.message);
                }
            }
        );
    }
});

module.exports = db;
