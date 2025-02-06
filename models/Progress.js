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
});

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress;
