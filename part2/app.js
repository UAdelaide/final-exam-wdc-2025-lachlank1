const express = require('express');
const path = require('path');
const db = require('./models/db');
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

    db.query('SELECT FROM Users WHERE username = ? and password = ?', [username, password], (results) => {
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // If user is found, return success message
        res.json({ message: 'Login successful', username, password });
        if (results[0].role === 'walker') {
            res.json({ message: 'Welcome Walker!', username });
            res.redirect
        }
        else if (results[0].role === 'owner') {
            res.json({ message: 'Welcome Owner!', username });
        }
    });
});
// Export the app instead of listening here
module.exports = app;