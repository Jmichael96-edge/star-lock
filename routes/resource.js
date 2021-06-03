const router = require('express').Router();
const ResourceController = require('../controllers/resource');

//! @route    POST api/resource/create
//! @desc     Create a resource
router.post('/create', ResourceController.createResource);

module.exports = router;