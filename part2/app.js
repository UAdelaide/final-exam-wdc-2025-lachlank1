const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

app.post('/login', (req, res) => {
    // Get username and password from request body
    const { username, password } = req.body;

    db.query('SELECT FROM Users')
    res.json({ message: 'Login successful', username, password });
});
// Export the app instead of listening here
module.exports = app;