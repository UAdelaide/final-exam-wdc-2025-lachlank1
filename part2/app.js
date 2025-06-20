const express = require('express');
const path = require('path');
const db = require('./models/db');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}

}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

app.post('/login', async (req, res) => {
    try{
        // Get username and password from request body
        const { username, password_hash } = req.body;
        const [rows] = await db.query(`SELECT user_id, username FROM Users WHERE username = ? AND password_hash = ?`, [username, password]);

        const user = rows[0];
        req.session.userid = user.user_id;

    }catch 
});
// Export the app instead of listening here
module.exports = app;