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
    const { username, password_hash } = req.body;

    const[rows] = await db.query(
        'SELECT * FROM Users WHERE username = ?', [username]
    )

    const user = rows[0]

    return res.json({
        message: 'Login succesful',
        user:{
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })

    });
});
// Export the app instead of listening here
module.exports = app;