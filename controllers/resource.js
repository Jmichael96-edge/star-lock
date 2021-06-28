const Resource = require('../models/resource');
const { isEmpty } = require('jvh-is-empty');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const PROD_FOLDER = 'star_lock_uploads_prod';
const DEV_FOLDER = 'star_lock_uploads_dev';
const CLOUDINARY_DIRECTORY = PROD_FOLDER;

cloudinary.config({
    cloud_name: 'edge-ofs',
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

//! @route    POST api/resource/create
//! @desc     Create a resource
exports.createResource = async (req, res, next) => {
    const newResource = new Resource({
        category: req.body.category,
        title: req.body.title,
        description: req.body.desc,
        ghLink: req.body.ghLink,
    });

    newResource.save().then(async (resource) => {
        if (req.files.length > 0) {
            let imgArr = req.files;
            for (let img of imgArr) {
                await cloudinary.uploader.upload(`images/${img.filename}`, {
                    folder: CLOUDINARY_DIRECTORY, 
                    public_id: img.filename,
                    unique_filename: true
                }, function (err, result) {
                    if (err) throw err;
                    resource.screenShots.push({ url: result.secure_url });
                });
            }
        }
        await resource.save();
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
                    serverMsg: 'There are currently no resources',
                    status: 404
                });
            }
            return res.status(200).json({
                items,
                status: 200
            });
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

//! @route    PUT api/resource/update/:id
//! @desc     Update a resource
exports.updateResource = async (req, res, next) => {
    let fetchedResource = await Resource.findById({ _id: req.params.id });

    if (!fetchedResource) {
        return res.status(404).json({
            serverMsg: 'Could not find the resource you were looking for'
        });
    }

    let resourceFields = {
        category: req.body.category,
        title: req.body.title,
        description: req.body.desc,
        ghLink: req.body.ghLink,
        screenShots: JSON.parse(req.body.currentImgArr)
    };

    await Resource.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: resourceFields },
        { new: true, upsert: true }
    ).then(async (item) => {
        if (isEmpty(item)) {
            return res.status(404).json({
                serverMsg: 'Could not find the resource you were looking for',
                status: 404
            });
        }

        // add the new images
        if (req.files.length > 0) {
            let imgArr = req.files;
            for (let img of imgArr) {
                await cloudinary.uploader.upload(`images/${img.filename}`, {
                    folder: CLOUDINARY_DIRECTORY,
                    use_filename: true,
                    unique_filename: false
                }, function (err, result) {
                    if (err) throw err;
                    item.screenShots.push({ url: result.secure_url });
                });
            }
        }
        await item.save();
        return res.status(201).json({
            serverMsg: 'Updated resource successfully',
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

//! @route    DELETE api/resource/delete/:id
//! @desc     Delete a resource
exports.deleteResource = async (req, res, next) => {
    let fetchedResource = await Resource.findById({ _id: req.params.id });
    if (!fetchedResource) {
        return res.status(404).json({
            serverMsg: 'Could not find the resource you were looking for'
        });
    }

    await Resource.findByIdAndDelete({ _id: req.params.id })
        .then(async (item) => {
            if (item.screenShots.length > 0 || !isEmpty(item.screenShots)) {
                for (let screenShot of item.screenShots) {
                    var productId = /[^/]*$/.exec(screenShot.url)[0];
                    let filePath = /(.*)\.()/.exec(productId)[1];

                    await cloudinary.uploader.destroy(`${CLOUDINARY_DIRECTORY}/${filePath}`, function (err, result) {
                        if (err) throw err;
                        console.log(result);
                    });
                    fs.unlink(path.join('images/' + filePath), (err) => {
                        if (err) throw err;
                    });
                }
            }
            return res.status(201).json({
                serverMsg: 'Successfully deleted resource'
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                serverMsg: 'There was a problem completing this request, please try again later.'
            });
        });
};
