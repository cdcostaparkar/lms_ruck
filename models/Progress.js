const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    enrollment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enrollment'
    },
    status: {
        type: Number,
        default: 0
    },
    // last_accessed_time: {
    //     type: Date,
    //     default: Date.now
    // }
});

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress;
