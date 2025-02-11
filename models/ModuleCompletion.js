const mongoose = require('mongoose');

// completion percentage for each module
const moduleCompletionSchema = new mongoose.Schema({
    enrollment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enrollment'
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    module_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    },
    completionPercentage: {
        type: Number, // decimal(3, 2) => like 0.0 - 1.0
        default: 0
    },
}, {timestamps: true});

const ModuleCompletion = mongoose.model('Progress', moduleCompletionSchema);
module.exports = ModuleCompletion;
