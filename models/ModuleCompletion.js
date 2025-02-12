const mongoose = require('mongoose');

// completion percentage for each module
const moduleCompletionSchema = new mongoose.Schema({
    enrollment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enrollment',
        required: true
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    module_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true
    },
    percentage: {
        type: Number, // decimal(3, 2) => like 0.0 - 1.0
        min: 0,
        max: 1,
        default: 0,
    },
}, { timestamps: true });

moduleCompletionSchema.index(
    { enrollment_id: 1, module_id: 1 },
    { unique: true }
);

const ModuleCompletion = mongoose.model('Progress', moduleCompletionSchema);
module.exports = ModuleCompletion;
