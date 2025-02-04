const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    enrolled_at: {
        type: Date,
        default: Date.now
    },
    completed_modules: {
        type: Number,
        default: 0
    }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;
