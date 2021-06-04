const mongoose = require('mongoose');

const ResourceSchema = mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ghLink: {
        type: String,
    },
    screenShots: [
        {
            url: {
                type: String,
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

const Resource = mongoose.model('Resource', ResourceSchema);

module.exports = Resource;