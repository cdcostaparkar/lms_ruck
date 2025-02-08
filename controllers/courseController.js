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

        const courseData = {
            title: req.body.title,
            description: req.body.description,
            trainer_id: req.params.userId
        };

        if (req.body.duration) {
            courseData.duration = req.body.duration;
        }

        const course = new Course(courseData);
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

// Get All Courses
exports.getAllCoursesX = async (req, res) => {
    try {
        const courses = await Course.find();
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
        const userId = req.query.userId;
        
        // Check if the course exists
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if the course belongs to the user
        // console.log(course.trainer_id.toString(), userId);
        if (course.trainer_id.toString() !== userId) {
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
// Get Courses Belonging to Trainer
exports.getTrainerCourses = async (req, res) => {
    try {
        const courses = await Course.find({ trainer_id: req.params.userId, isDeleted: false });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Courses Not Belonging to Trainer
exports.getNotTrainerCourses = async (req, res) => {
    try {
        const courses = await Course.find({ trainer_id: { $ne: req.params.userId }, isDeleted: false });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
// Get User Courses - Replaced with getAllEnrolledCourses
exports.getUserCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student_id: req.params.userId }).populate('course_id');
        res.json(enrollments);
    } catch (error) {
        res.status(404).json({ error: 'Courses not found' });
    }
};


/* Admin APIs */
// Delete All Courses
exports.deleteAllCourses = async (req, res) => {
    try {
        await Course.updateMany({}, { isDeleted: true });
        res.json({ message: 'All courses have been soft deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Permanently Delete Course
exports.permanentlyDeleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json({ message: 'Course has been permanently deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// Permanently Delete All Courses
exports.adminDeleteCourses = async (req, res) => {
    try {
        await Course.deleteMany({});
        res.json({ message: 'All courses have been permanently deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};