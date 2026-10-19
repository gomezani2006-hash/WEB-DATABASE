const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "portfolio.db");

const db = new sqlite3.Database(dbPath, (error) => {
    if (error) {
        console.error("Database connection failed:", error.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

module.exports = db;