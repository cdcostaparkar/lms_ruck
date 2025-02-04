const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Create Course
exports.createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get User Courses
exports.getUserCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student_id: req.params.userId }).populate('course_id');
        res.json(enrollments);
    } catch (error) {
        res.status(404).json({ error: 'Courses not found' });
    }
};

// Update Course
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
        res.json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Soft Delete Course
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.courseId, { deleted: true }, { new: true });
        res.json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Trainer Courses
exports.getTrainerCourses = async (req, res) => {
    try {
        const courses = await Course.find({ trainer_id: req.params.trainerId });
        res.json(courses);
    } catch (error) {
        res.status(404).json({ error: 'Courses not found' });
    }
};
