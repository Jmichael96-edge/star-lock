const router = require('express').Router();
const path = require('path');

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../app/index.html'));
});

router.get('/new_resource', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../app/new_resource.html'));
});

module.exports = router;