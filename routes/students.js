const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all students
router.get('/', (req, res) => {
  const searchQuery = req.query.search || '';
  let sql = 'SELECT * FROM students';
  let params = [];

  if (searchQuery) {
    sql += ` WHERE name LIKE ? OR uid LIKE ? OR branch LIKE ?`;
    params = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.render('index', { students: rows, searchQuery });
  });
});

// Add new student
router.post('/add', (req, res) => {
  const { uid, name, semester, branch, status } = req.body;
  const sql = `INSERT INTO students (uid, name, semester, branch, status) VALUES (?, ?, ?, ?, ?)`;
  
  db.run(sql, [uid, name, semester, branch, status], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.redirect('/');
  });
});

// Get student for editing
router.get('/edit/:uid', (req, res) => {
  const sql = `SELECT * FROM students WHERE uid = ?`;
  db.get(sql, [req.params.uid], (err, student) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.render('edit', { student });
  });
});

// Update student
router.post('/update/:uid', (req, res) => {
  const { name, semester, branch, status } = req.body;
  const sql = `UPDATE students SET name = ?, semester = ?, branch = ?, status = ? WHERE uid = ?`;
  
  db.run(sql, [name, semester, branch, status, req.params.uid], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.redirect('/');
  });
});

// Delete student
router.get('/delete/:uid', (req, res) => {
  const sql = `DELETE FROM students WHERE uid = ?`;
  db.run(sql, [req.params.uid], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.redirect('/');
  });
});

module.exports = router;