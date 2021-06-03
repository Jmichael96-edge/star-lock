const Resource = require('../models/resource');
const { get } = require('../routes');

//! @route    POST api/resource/create
//! @desc     Create a resource
exports.createResource = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');

    const newResource = new Resource({
        title: req.body.title,
        description: req.body.desc,
        ghLink: req.body.ghLink,
        screenShots: req.files.map((file) => { return { url: url + '/images/' + file.filename }})
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