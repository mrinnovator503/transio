// routes/students.js
const express = require('express');
const router = express.Router();
const db = require('../database');

// Home page - list all students
router.get('/', async (req, res) => {
  try {
    const result = await db.pool.query('SELECT * FROM students ORDER BY uid');
    res.render('index', { students: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err });
  }
});

// Display add student form
router.get('/add', (req, res) => {
  res.render('add');
});

// Add new student
router.post('/add', async (req, res) => {
  try {
    const { uid, name, semester, branch } = req.body;
    await db.pool.query(
      'INSERT INTO students (uid, name, semester, branch, status) VALUES ($1, $2, $3, $4, $5)',
      [uid, name, semester, branch, 'active']
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err });
  }
});

// Display edit student form
router.get('/edit/:uid', async (req, res) => {
  try {
    const result = await db.pool.query('SELECT * FROM students WHERE uid = $1', [req.params.uid]);
    if (result.rows.length > 0) {
      res.render('edit', { student: result.rows[0] });
    } else {
      res.status(404).render('error', { error: 'Student not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err });
  }
});

// Update student
router.post('/edit/:uid', async (req, res) => {
  try {
    const { name, semester, branch, status } = req.body;
    await db.pool.query(
      'UPDATE students SET name = $1, semester = $2, branch = $3, status = $4 WHERE uid = $5',
      [name, semester, branch, status, req.params.uid]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err });
  }
});

// Delete student
router.get('/delete/:uid', async (req, res) => {
  try {
    await db.pool.query('DELETE FROM students WHERE uid = $1', [req.params.uid]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err });
  }
});

// Toggle student status
router.post('/toggle-status/:uid', async (req, res) => {
  try {
    await db.pool.query(`
      UPDATE students 
      SET status = CASE 
        WHEN status = 'active' THEN 'inactive' 
        ELSE 'active' 
      END 
      WHERE uid = $1
    `, [req.params.uid]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err });
  }
});

module.exports = router;