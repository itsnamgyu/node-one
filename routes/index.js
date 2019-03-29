const express = require('express');
const path = require('path');
const router = express.Router();

const viewsDir = path.join(path.dirname(__dirname), 'views');

router.get('/', (req, res) => {
    res.sendFile(path.join(viewsDir, 'index.html'));
});

module.exports = router;