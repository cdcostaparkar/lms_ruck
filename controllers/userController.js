const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const Role = require('../models/Role')

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

        const role = await Role.findById(user.role_id);
        if (!role) {
            return res.status(401).json({ error: 'Invalid Role' });
        }
        // const roleName = role ? role.role_name : 'Unknown role';

        // Return user ID and role name
        res.json({ userId: user._id, role_name: role.role_name });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create User - createUser
exports.createUser = async (req, res) => {
    try {
        const {role_name, ...userData} = req.body;
        const role = await Role.findOne({role_name});
        if(!role){
            return res.status(404).json({error:'Role not found'});
        }

        const user = new User({
            ...userData,
            role_id:role._id 
        });
        await user.save();
        res.status(201).json({
            userId: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role_id: user.role_id 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/*Come back to this to check populate and when details are added in other tables*/
// Get User Details - getUserDetails
exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('role_id','role_name');

        if(!user){
            return res.status(404).json({error:'User not found'});
        }

        const userDetails = {
            username: user.username,
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            role_name:user.role_id.role_name
        };
        res.json(userDetails);
    } catch (error) {
        res.status(404).json({ error: error.message });
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


/* Check After adding the records for other tables */
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
        const result = await User.deleteMany({});
        res.json({ message: `${result.deletedCount} users deleted successfully.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Users - getAllUsers
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Retrieve all users from the User collection
        res.json(users); // Return the list of users
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle any errors
    }
};

