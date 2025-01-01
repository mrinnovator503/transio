const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const db = require('./database');
const cors = require('cors');

const app = express();

// Add debugging logs to understand what we're importing
console.log('Starting route imports...');

// Import routes with try-catch to catch any potential errors
let studentRoutes;
let apiRoutes;

try {
    studentRoutes = require('./routes/students');
    console.log('studentRoutes type:', typeof studentRoutes);
    console.log('studentRoutes is router:', studentRoutes instanceof express.Router);
} catch (error) {
    console.error('Error importing studentRoutes:', error);
}

try {
    apiRoutes = require('./routes/api');
    console.log('apiRoutes type:', typeof apiRoutes);
    console.log('apiRoutes is router:', apiRoutes instanceof express.Router);
} catch (error) {
    console.error('Error importing apiRoutes:', error);
}

// Enable CORS for all routes
app.use(cors());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// EJS layout setup
app.use(ejsLayouts);
app.set('layout', 'layout');

// Middleware setup
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mount routes with additional error checking
if (studentRoutes && typeof studentRoutes === 'function') {
    console.log('Mounting studentRoutes...');
    app.use('/', studentRoutes);
} else {
    console.error('Invalid studentRoutes:', studentRoutes);
}

if (apiRoutes && typeof apiRoutes === 'function') {
    console.log('Mounting apiRoutes...');
    app.use('/api', apiRoutes);
} else {
    console.error('Invalid apiRoutes:', apiRoutes);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;