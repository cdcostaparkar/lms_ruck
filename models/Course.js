const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    trainer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    duration: {
        type: String,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
