const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // check null or leave blank
    video_url: {
        type: String,
        default: null
    },
    content: {
        type: String,
        required: true
    },
    module_order: {
        type: Number,
        required: true
    },
    duration: {
        type: Number, // in days
        required: true
    },
});

const Module = mongoose.model('Module', moduleSchema);
module.exports = Module;
