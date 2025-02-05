const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');

// Authenticate User - authUser
exports.authUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Return user ID
        res.json({ userId: user._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create User - createUser
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get User Details - getUserDetails
exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
};

/* Needs edits */

// Get User Progress - getUserProgress
exports.getUserProgress = async (req, res) => {
    try {
        const progress = await Progress.find({ enrollment_id: req.params.userId });
        res.json(progress);
    } catch (error) {
        res.status(404).json({ error: 'Progress not found' });
    }
};

// Get Completed Courses -getCompletedCourses
exports.getCompletedCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student_id: req.params.userId });
        const completedCourses = enrollments.filter(enrollment => enrollment.completed_modules > 0);
        res.json(completedCourses);
    } catch (error) {
        res.status(404).json({ error: 'Courses not found' });
    }
};

// Admin Delete Users - adminDeleteUsers
exports.adminDeleteUsers = async (req, res) => {
    try {
        // Delete all users from the User collection
        console.log("hi");
        const result = await User.deleteMany({});
        res.json({ message: `${result.deletedCount} users deleted successfully.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
