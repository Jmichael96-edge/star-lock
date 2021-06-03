const Resource = require('../models/resource');
const { isEmpty } = require('@misterjvh/is_empty_96');

//! @route    POST api/resource/create
//! @desc     Create a resource
exports.createResource = (req, res, next) => {
    if (!req.body.title) {
        return res.status(500).json({
            serverMsg: 'You must enter a title'
        });
    }

    const newResource = new Resource({
        title: req.body.title,
    });

    newResource.save().then((resource) => {
        res.status(201).json({
            serverMsg: 'Created resource successfully',
            resource
        });
    }).catch((err) => {
        console.error(err);
        res.status(500).json({
            serverMsg: 'There was a problem completing this request, please try again later.'
        });
    });
};