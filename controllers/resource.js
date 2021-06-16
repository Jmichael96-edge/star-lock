const Resource = require('../models/resource');
const { isEmpty } = require('jvh-is-empty');

//! @route    POST api/resource/create
//! @desc     Create a resource
exports.createResource = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    console.log(url);
    const newResource = new Resource({
        category: req.body.category,
        title: req.body.title,
        description: req.body.desc,
        ghLink: req.body.ghLink,
        screenShots: req.files.length > 0 ? req.files.map((file) => { return { url: url + '/assets/images/uploads/' + file.filename } }) : null
    });

    newResource.save().then((resource) => {
        res.status(201).json({
            serverMsg: 'Created resource successfully',
            resource
        });
    }).catch((err) => {
        console.error('ERROR ', err);
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
            console.log(items);
            return res.status(200).json(items);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                serverMsg: 'There was a problem completing this request, please try again later.'
            });
        });
};

//! @route    GET api/resource/fetch_resource/:id
//! @desc     Fetch a resource
exports.fetchResource = (req, res, next) => {
    Resource.findById({ _id: req.params.id })
    .then((item) => {
        if (isEmpty(item)) {
            return res.status(404).json({
                serverMsg: 'Could not find the resource you were looking for',
                status: 404
            });
        }
        return res.status(200).json({
            status: 200,
            resource: item
        });
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({
            serverMsg: 'There was a problem completing this request, please try again later.'
        });
    });
};