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
        type: Number,
        default: 0,
        min:[0, 'Duration must be a positive number.']
    },
    isDeleted: {
        type: Boolean,
        default: false //for-soft delete
    }
    // created_at: {
    //     type: Date,
    //     default: Date.now
    // },
    // updated_at: {
    //     type: Date,
    //     default: Date.now
    // }
}, {timestamps: true});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
