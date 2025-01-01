const express = require('express');
const router = express.Router();
const db = require('../database');

// Enable CORS for all API routes
router.use(cors());

// Get student by UID (for IoT devices)
router.get('/student/:uid', (req, res) => {
  const sql = `SELECT * FROM students WHERE uid = ?`;
  db.get(sql, [req.params.uid], (err, student) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      if (student) {
          res.json({
              uid: student.uid,
              name: student.name,
              status: student.status
          });
      } else {
          res.status(404).json({ error: 'Student not found' });
      }
  });
});

console.log('Exporting apiRoutes router type:', typeof router);
module.exports = router;