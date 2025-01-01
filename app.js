const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');  // Add this line
const db = require('./database');
const studentRoutes = require('./routes/students');
const apiRoutes = require('./routes/api');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// EJS layout setup
app.use(ejsLayouts);  // Add this line
app.set('layout', 'layout');  // Add this line

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Web routes
app.use('/', studentRoutes);

// API routes for IoT devices
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
