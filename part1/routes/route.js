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

router.get('/walkrequests/open', async (req, res) => {
    const [requests] = await db.query(`
        SELECT wr.request_id as request_id,
        d.name as dog_name,
        wr.requested_time as requested_time,
        wr.duration_minutes as duration_minutes,
        wr.location as location,
        u.username as owner_username
        FROM WalkRequests wr
        JOIN Dogs d ON wr.dog_id = d.dog_id
        JOIN Users u ON d.owner_id = u.user_id
        WHERE wr.status = 'open'
    `);
    res.json(requests);
});

router.get('/walkers/ratings', async (req, res) => {
    const [ratings] = await db.query(`
        SELECT u.username as walker_username,
        COUNT(r.rating) as total_ratings,
        AVG(r.rating) as average_rating,
        (SELECT COUNT(*) FROM WalkRatings wr JOIN WalkApplications wa on wr.request_id = wa.request_id WHERE wa.walker_id = u.user_id) AS completed_walks
        FROM Users u
        LEFT JOIN WalkRatings r ON r.walker_id = u.user_id
        WHERE u.role = 'walker'
    `);
    res.json(ratings);
});

module.exports = router;
