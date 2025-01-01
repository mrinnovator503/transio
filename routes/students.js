const express = require('express');
const router = express.Router();
const db = require('../database');

// Helper function to handle database errors
const handleDatabaseError = (err, res) => {
    console.error('Database error:', err);
    return res.render('error', { 
        error: 'Sorry, there was a problem accessing the database. Please try again later.' 
    });
};

// Main route that handles both initial page load and search
router.get('/', async (req, res) => {
    try {
        // Get the search query from request, defaulting to empty string
        const searchQuery = req.query.search || '';
        
        // Base query for all students
        let query = `
            SELECT uid, first_name, last_name, email, enrollment_date 
            FROM students
        `;
        
        let queryParams = [];
        
        // If there's a search term, modify the query to include WHERE clause
        if (searchQuery) {
            query += `
                WHERE 
                    LOWER(first_name) LIKE LOWER($1) OR 
                    LOWER(last_name) LIKE LOWER($1) OR 
                    LOWER(email) LIKE LOWER($1)
            `;
            queryParams.push(`%${searchQuery}%`);
        }
        
        // Add ordering to keep results consistent
        query += ' ORDER BY last_name, first_name';
        
        // Execute the query using PostgreSQL's query method
        const result = await db.pool.query(query, queryParams);
        
        // Render the page with both results and the search query
        res.render('index', {
            students: result.rows,
            searchQuery: searchQuery  // Pass this to maintain the search box state
        });
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

// Add new student
router.post('/', async (req, res) => {
    const { first_name, last_name, email, enrollment_date } = req.body;
    
    try {
        const query = `
            INSERT INTO students (first_name, last_name, email, enrollment_date)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        
        await db.pool.query(query, [first_name, last_name, email, enrollment_date]);
        res.redirect('/');
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

// Update student
router.put('/:uid', async (req, res) => {
    const { uid } = req.params;
    const { first_name, last_name, email, enrollment_date } = req.body;
    
    try {
        const query = `
            UPDATE students 
            SET first_name = $1, last_name = $2, email = $3, enrollment_date = $4
            WHERE uid = $5
            RETURNING *
        `;
        
        const result = await db.pool.query(query, [
            first_name, last_name, email, enrollment_date, uid
        ]);
        
        if (result.rows.length === 0) {
            return res.status(404).render('error', { 
                error: 'Student not found' 
            });
        }
        
        res.redirect('/');
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

// Delete student
router.delete('/:uid', async (req, res) => {
    const { uid } = req.params;
    
    try {
        const query = 'DELETE FROM students WHERE uid = $1 RETURNING *';
        const result = await db.pool.query(query, [uid]);
        
        if (result.rows.length === 0) {
            return res.status(404).render('error', { 
                error: 'Student not found' 
            });
        }
        
        res.redirect('/');
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

module.exports = router;