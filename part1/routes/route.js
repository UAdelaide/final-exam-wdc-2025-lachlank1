var express = require('express');
var router = express.Router();
var db = require('../db'); // Import the database connection

router.get('/dogs', async (req, res) => {
    const [dogs] = await db.query(`
        SELECT d.name AS dog_name,
        d.size AS size,
        u.username as owner_username
        FROM Dogs d
        JOIN Users u ON d.owner_id =  u.user_id
    `);
    res.json(dogs);
});

router.get('/walkrequets/open', async (req, res) => {
    const [requests] = await db.query(`
        SELECT wr.request_id as request_id,
        wr.dog_id as dog_name
        wr.request_time as request_time,
        wr.duration_minutes as duration_minutes,
        wr.location as location,
        Join Dogs d ON wr.dog_id = d.dog_id
        Join  Users u ON d.owner_id = u.user_id
        WHERE wr.status = 'open'
    `);
    res.json(requests);
});

module.exports = router;
