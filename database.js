// database.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize database
async function initDatabase() {
  try {
    // Create the students table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        uid TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        semester INTEGER,
        branch TEXT,
        status TEXT CHECK(status IN ('active', 'inactive'))
      )
    `);

    // Check if table is empty and add test data if needed
    const result = await pool.query('SELECT COUNT(*) as count FROM students');
    if (result.rows[0].count === '0') {
      await pool.query(`
        INSERT INTO students (uid, name, semester, branch, status) 
        VALUES ($1, $2, $3, $4, $5)
      `, ['12345', 'Test Student', 1, 'Computer Science', 'active']);
    }

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
}

// Get student by UID
async function getStudentByUid(uid) {
  const result = await pool.query('SELECT * FROM students WHERE uid = $1', [uid]);
  return result.rows[0];
}

// Add new student
async function addStudent(student) {
  const result = await pool.query(`
    INSERT INTO students (uid, name, semester, branch, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [student.uid, student.name, student.semester, student.branch, student.status || 'active']);
  return result.rows[0];
}

// Get all students
async function getAllStudents() {
  const result = await pool.query('SELECT * FROM students ORDER BY uid');
  return result.rows;
}

// Update student
async function updateStudent(uid, student) {
  const result = await pool.query(`
    UPDATE students 
    SET name = $2, semester = $3, branch = $4, status = $5
    WHERE uid = $1
    RETURNING *
  `, [uid, student.name, student.semester, student.branch, student.status]);
  return result.rows[0];
}

// Delete student
async function deleteStudent(uid) {
  await pool.query('DELETE FROM students WHERE uid = $1', [uid]);
}

module.exports = {
  initDatabase,
  getStudentByUid,
  addStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,
  pool
};