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
// const part1MessagesRoute = require('../part1/routes/messages.js'); // Added to be able to use route from part1


app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);
// app.use('/api', part1MessagesRoute); // Added to be able to use route from part1


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
    // get the users dogs id and name
    const [rows] = await db.query(`SELECT dog_id, name FROM Dogs WHERE owner_id = ?`, [req.session.userid]);
    res.json(rows);
});

app.get('/api/users/me', (req, res) => { // Route for getting current user
    res.json({
        userid: req.session.userid,
        username: req.session.username,
        role: req.session.role
    });
});

app.get('/api/dogs', async (req, res) => { // Changed to accomodate for penny's video
    const [dogs] = await db.query(` 
        SELECT d.name AS dog_name,
        d.size AS size,
        d.dog_id as dog_id,
        d.owner_id AS owner_id
        FROM Dogs d
    `);
    res.json(dogs);
});


// Export the app instead of listening here
module.exports = app;