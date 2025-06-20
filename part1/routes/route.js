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

module.exports = router;
