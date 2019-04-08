const express = require('express');
const router = express.Router();

router.route('/')
    .get((req, res) => {
        res.render('index.html', {
            user: req.user,
        });
    });

module.exports = router;
