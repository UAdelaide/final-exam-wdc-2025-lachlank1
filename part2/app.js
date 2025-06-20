const express = require('express');
const path = require('path');
const db = require('./models/db');
const session = require('express-session'); // import session middeware
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // parse json and urlencoded bodies
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({ // set up session middleware
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }

}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// login route
app.post('/login', async (req, res) => {
        // Get username and password from request body
        const { username, password } = req.body;

        // Get user details
        const [rows] = await db.query(`SELECT user_id, username, role FROM Users WHERE username = ? AND password_hash = ?`, [username, password]);

        // if the user exists, set session variables
        const user = rows[0];
        req.session.userid = user.user_id;
        req.session.username = user.username;
        req.session.role = user.role;

        // Redirect based on user role
        if (user.role === 'owner'){
            res.redirect('/owner-dashboard.html');
        }else{
            res.redirect('/walker-dashboard.html');
        }
});
// logout route
app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(() => {
        res.clearCookie('connect.sid'); // clear the session cookie
        res.redirect('/'); // Redirect to the home page
    });
});

// route for getting dogs

app.get('/dogs', async (req, res) => {
    if (!req.session.useri) {

// Export the app instead of listening here
module.exports = app;