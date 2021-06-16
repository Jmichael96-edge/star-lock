// const path = require('path');
const router = require('express').Router();
const htmlRoutes = require('./htmlRoutes');
const resource = require('./resource');

router.use(htmlRoutes)
router.use('/api/resource', resource);

module.exports = router;