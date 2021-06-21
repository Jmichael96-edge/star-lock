const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'edge-ofs',
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const createPhoto = async (filename) => {
    cloudinary.uploader.upload(`app/assets/images/uploads/${filename}`, function(err, result) {
        if (err) throw err;
        console.log(result.secure_url);
        return result.secure_url;
    });
};

module.exports = createPhoto;