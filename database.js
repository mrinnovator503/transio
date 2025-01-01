const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use an absolute path for the database
const dbPath = path.resolve(__dirname, 'students.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      uid TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      semester INTEGER,
      branch TEXT,
      status TEXT CHECK(status IN ('active', 'inactive'))
    )
  `);
  
  // Add some test data if the table is empty
  db.get("SELECT COUNT(*) as count FROM students", [], (err, row) => {
    if (!err && row.count === 0) {
      db.run(`INSERT INTO students (uid, name, semester, branch, status) 
              VALUES ('12345', 'Test Student', 1, 'Computer Science', 'active')`);
    }
  });
});

module.exports = db;