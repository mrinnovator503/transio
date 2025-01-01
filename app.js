const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const db = require('./database');
const cors = require('cors');  // Add this line

const app = express();

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

// Import routes
const studentRoutes = require('./routes/students');
const apiRoutes = require('./routes/api');

// Use routes - Make sure these lines come after importing the routes
app.use('/', studentRoutes);
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;  // Add this line for testing purposes