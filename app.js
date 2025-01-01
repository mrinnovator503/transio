// app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const db = require('./database');
const cors = require('cors');

const app = express();

// Add debugging logs
console.log('Starting route imports...');

// Import routes
const studentRoutes = require('./routes/students');
const apiRoutes = require('./routes/api');

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

// Mount routes
app.use('/', studentRoutes);
app.use('/api', apiRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;

// Initialize database before starting the server
db.initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

module.exports = app;