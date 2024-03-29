const router = require('express').Router();
const ResourceController = require('../controllers/resource');
const extractScreenShots = require('../middleware/extractScreenShots');

//! @route    POST api/resource/create
//! @desc     Create a resource
router.post('/create', extractScreenShots, ResourceController.createResource);

//! @route    GET api/resource/all
//! @desc     Fetch all resources
router.get('/all', ResourceController.fetchAll);

//! @route    GET api/resource/fetch_resource/:id
//! @desc     Fetch a resource
router.get('/fetch_resource/:id', ResourceController.fetchResource);

//! @route    PUT api/resource/update/:id
//! @desc     Update a resource
router.put('/update/:id', extractScreenShots, ResourceController.updateResource);

//! @route    DELETE api/resource/delete/:id
//! @desc     Delete a resource
router.delete('/delete/:id', ResourceController.deleteResource);

module.exports = router;