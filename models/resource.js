const mongoose = require('mongoose');

const ResourceSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Resource = mongoose.model('Resource', ResourceSchema);

module.exports = Resource;