var express = require('express');
var router = express.Router();
var db = require('../db'); // Import the database connection

router.get('/dogs', async (req, res) => {
    const [dogs] = await db.query(`
        SELECT d.name as dog_name,
        FROM Dogs d
        SELECT d.size as size,
        FROM Dogs d
        JOIN Users u ON d.owner_id = u.user_name 

    `)