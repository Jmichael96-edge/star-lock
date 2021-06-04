const Resource = require('../models/resource');
const { isEmpty } = require('jvh-is-empty');

//! @route    POST api/resource/create
//! @desc     Create a resource
exports.createResource = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');

    const newResource = new Resource({
        category: req.body.category,
        title: req.body.title,
        description: req.body.desc,
        ghLink: req.body.ghLink,
        screenShots: req.files.length > 0 ? req.files.map((file) => { return { url: url + '/images/' + file.filename } }) : null
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

//! @route    GET api/resource/all
//! @desc     Fetch all resources
exports.fetchAll = (req, res, next) => {
    Resource.find().sort({ id: -1 })
        .then((items) => {
            if (isEmpty(items)) {
                return res.status(404).json({
                    serverMsg: 'There are currently no resources'
                });
            }
            return res.status(200).json(items);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                serverMsg: 'There was a problem completing this request, please try again later.'
            });
        });
};