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
    // Drop the students table if it exists
    await pool.query('DROP TABLE IF EXISTS students');

    // Create the students table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        uid TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        enrollment_date DATE,
        semester INTEGER,
        branch TEXT,
        status TEXT CHECK(status IN ('active', 'inactive'))
      )
    `);

    // Check if table is empty and add test data if needed
    const result = await pool.query('SELECT COUNT(*) as count FROM students');
    if (result.rows[0].count === '0') {
      await pool.query(`
        INSERT INTO students (uid, first_name, last_name, email, enrollment_date, semester, branch, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, ['12345', 'Test', 'Student', 'test.student@example.com', '2022-01-01', 1, 'Computer Science', 'active']);
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
    INSERT INTO students (uid, first_name, last_name, email, enrollment_date, semester, branch, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `, [student.uid, student.first_name, student.last_name, student.email, student.enrollment_date, student.semester, student.branch, student.status || 'active']);
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
    SET first_name = $2, last_name = $3, email = $4, enrollment_date = $5, semester = $6, branch = $7, status = $8
    WHERE uid = $1
    RETURNING *
  `, [uid, student.first_name, student.last_name, student.email, student.enrollment_date, student.semester, student.branch, student.status]);
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