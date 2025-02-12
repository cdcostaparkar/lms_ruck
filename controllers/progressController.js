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



exports.getProgress = async (req, res) => {
  try {
    // Fetch all progress entries
    const progress = await Progress.find();

    if (!progress || progress.length === 0) {
      return res.status(404).json({
        message: 'No progress entries found',
      });
    }

    res.status(200).json({
      message: 'Progress entries retrieved successfully',
      progress,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving progress entries',
      error,
    });
  }
};
