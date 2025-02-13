const ModuleCompletion = require('../models/ModuleCompletion');

// retrieve module completion records of user course to check isDone(percentage == 1) 
exports.getModuleCompletionRecords = async (req, res) => {
  const { enrollment_id, course_id } = req.body;

  try {
    // Validate that both enrollment_id and course_id are provided
    if (!enrollment_id || !course_id) {
      return res.status(400).json({
        message: "Both enrollment_id and course_id are required.",
      });
    }

    // Retrieve all module completion records that match both enrollment_id and course_id
    const completionRecords = await ModuleCompletion.find({
      enrollment_id: enrollment_id,
      course_id: course_id,
    }).populate("module_id"); // Populate the module_id field and select the 'name' field

    if (!completionRecords || completionRecords.length === 0) {
      return res.status(404).json({
        message:
          "No module completion records found for the given enrollment and course.",
      });
    }

    res.status(200).json(completionRecords);
  } catch (error) {
    console.error("Error fetching module completion records:", error);
    res.status(500).json({
      message: "Error fetching module completion records.",
      error: error.message,
    });
  }
};

// update percentage completion of a module
exports.updateModulePercentage = async (req, res) => {
  const { enrollment_id, module_id, percentage } = req.body;

  try {
    // Validate percentage
    if (percentage < 0 || percentage > 1) {
      return res
        .status(400)
        .json({ message: "Percentage must be between 0 and 1." });
    }

    // Check if the record exists
    const existingCompletion = await ModuleCompletion.findOne({
      enrollment_id: enrollment_id,
      module_id: module_id,
    });

    if (existingCompletion) {
      // Update the existing record
      existingCompletion.percentage = percentage;
      await existingCompletion.save();

      return res.status(200).json({
        message: "Module completion percentage updated successfully.",
        completion: existingCompletion,
      });
    } else {
      // Record not found, return an error
      return res.status(404).json({
        message:
          "Module completion record not found for the given enrollment and module.",
      });
    }
  } catch (error) {
    console.error("Error updating module completion:", error);
    res.status(500).json({
      message: "Error updating module completion percentage.",
      error: error.message,
    });
  }
};

  

// Admin APIs
exports.getAllModuleCompletion = async (req, res) => {
  try {
    // Fetch all progress entries
    const moduleCompletion = await ModuleCompletion.find();

    if (!moduleCompletion || moduleCompletion.length === 0) {
      return res.status(404).json({
        message: 'No progress entries found',
      });
    }

    res.status(200).json({
      message: 'Progress entries retrieved successfully',
      moduleCompletion,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving progress entries',
      error,
    });
  }
};