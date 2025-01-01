// routes/api.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const cors = require('cors');

router.use(cors());

// Get student by UID (for IoT devices)
router.get('/student/:uid', async (req, res) => {
  try {
    const student = await db.getStudentByUid(req.params.uid);
    if (student) {
      res.json({
        uid: student.uid,
        name: student.name,
        semester: student.semester,
        branch: student.branch,
        status: student.status
      });
    } else {
      res.json({ error: 'Student not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new student
router.post('/student', async (req, res) => {
  try {
    const student = await db.addStudent(req.body);
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update student
router.put('/student/:uid', async (req, res) => {
  try {
    const student = await db.updateStudent(req.params.uid, req.body);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete student
router.delete('/student/:uid', async (req, res) => {
  try {
    await db.deleteStudent(req.params.uid);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all students
router.get('/students', async (req, res) => {
  try {
    const students = await db.getAllStudents();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;