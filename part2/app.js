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
    //     Get username and password from request body
        const { username, password } = req.body;
        const [rows] = await db.query(`SELECT username, role FROM Users WHERE username = ? AND password_hash = ?`, [username, password]);

        if (rows.length === 0 ){
            return res.status(401).json({ error: "Wrong login" });
        }
        const user = rows[0];
        req.session.userid = user.user_id;
        req.session.role = user.role;

        if (user.role === 'owner'){
            res.redorect('/owner-dashboard.html');
        }else{
            res.redirect('/walker-dashboard.html');
        }



    // }catch
});
// Export the app instead of listening here
module.exports = app;