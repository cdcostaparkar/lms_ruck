const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

// Create Course - working wohoo
exports.createCourse = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('role_id', 'role_name');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user's role is "trainer"
        const roleName = user.role_id ? user.role_id.role_name : 'Unknown role';
        if (roleName !== 'trainer') {
            return res.status(404).json({ error: 'Trainer not found' });
        }

        const course = new Course({
            title: req.body.title,
            description: req.body.description,
            trainer_id: req.params.userId
        });
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isDeleted: false });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Management How for security
// Update Course
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        
        // Check if the course exists
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if the course belongs to the user
        if (course.trainer_id.toString() !== req.params.userId) {
            return res.status(403).json({ error: 'Unauthorized: You do not have permission to update this course' });
        }

        // Update the course
        const updatedCourse = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
        res.json(updatedCourse);
        
        // const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
        // res.json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Soft Delete Course
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.courseId, { isDeleted: true }, { new: true });
        res.json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Trainer Courses - for Security but more hits on server(not fully implemented)
// exports.getTrainerCourses = async (req, res) => {
//     try {
//         const courses = await Course.find({ trainer_id: req.params.trainerId });
//         res.json(courses);
//     } catch (error) {
//         res.status(404).json({ error: 'Courses not found' });
//     }
// };

/* Do once enrollment is done */
// Get User Courses
exports.getUserCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student_id: req.params.userId }).populate('course_id');
        res.json(enrollments);
    } catch (error) {
        res.status(404).json({ error: 'Courses not found' });
    }
};