// const path = require('path');
const router = require('express').Router();
const htmlRoutes = require('./htmlRoutes');
const resource = require('./resource');

router.use(htmlRoutes)
router.use('/api/resource', resource);

// ! UNCOMMENT WHEN PUSHING TO PRODUCTION
// router.use((req, res) => {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

module.exports = router;