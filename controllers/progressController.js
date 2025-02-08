const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');

exports.updateProgress = async (req, res) => {
    const { userId, enrollmentId } = req.params;
    const { status } = req.body; // Assuming status is sent in the request body

    try {
        // Find the enrollment by userId and enrollmentId
        const enrollment = await Enrollment.findOne({
            _id: enrollmentId,
            student_id: userId,
            isDeleted: false
        });

        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found or deleted' });
        }

        // Update the progress for the enrollment
        const progress = await Progress.findOneAndUpdate(
            { enrollment_id: enrollmentId },
            { status },
            { new: true, upsert: true } // Create a new progress entry if it doesn't exist
        );

        res.status(200).json({ message: 'Progress updated successfully', progress });
    } catch (error) {
        res.status(500).json({ message: 'Error updating progress', error });
    }
};
