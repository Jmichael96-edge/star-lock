const path = require('path');
const router = require('express').Router();
const htmlRoutes = require('./htmlRoutes');

router.use(htmlRoutes);

// ! UNCOMMENT WHEN PUSHING TO PRODUCTION
router.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = router;