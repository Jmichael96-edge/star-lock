const router = require('express').Router();
const ResourceController = require('../controllers/resource');
const extractScreenShots = require('../middleware/extractScreenShots');

//! @route    POST api/resource/create
//! @desc     Create a resource
router.post('/create', extractScreenShots, ResourceController.createResource);

module.exports = router;