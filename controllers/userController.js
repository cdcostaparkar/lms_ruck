const User = require('../models/User');
const Enrollment = require('../models/Enrollment'); // to implement the schema
const Progress = require('../models/Progress');
const Role = require('../models/Role')

// reset Password
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Hash the new password
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to reset password.' });
    }
};

// Get User by Email
exports.getUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Return the user object
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Authenticate User - authUser
exports.authUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid Username' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid Password' });
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
        const { role_name, ...userData } = req.body;
        const role = await Role.findOne({ role_name });
        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        const user = new User({
            ...userData,
            role_id: role._id
        });
        await user.save();
        res.status(201).json({
            userId: user._id,
            role_name: role_name
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/*Come back to this to check populate and when details are added in other tables*/
// Get User Details - getUserDetails
exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('role_id', 'role_name'); // populate: we are taking

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userDetails = {
            username: user.username,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role_name: user.role_id.role_name
        };
        res.json(userDetails);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

/* Needs edits */

// Get User Progress - getUserProgress(Not Used)
exports.getUserProgress = async (req, res) => {
    try {
        const progress = await Progress.find({ enrollment_id: req.params.userId });
        res.json(progress);
    } catch (error) {
        res.status(404).json({ error: 'Progress not found' });
    }
};


/* Check After adding the records for other tables */
// Get Completed Courses -getCompletedCourses(Not Used)
exports.getCompletedCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student_id: req.params.userId });
        const completedCourses = enrollments.filter(enrollment => enrollment.completed_modules > 0);
        res.json(completedCourses);
    } catch (error) {
        res.status(404).json({ error: 'Courses not found' });
    }
};


/* Admin APIs */
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

// Admin Delete User by ID - adminDeleteUserId
exports.adminDeleteUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        // Delete the user with the specified ID from the User collection
        const result = await User.findByIdAndDelete(userId);
        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully.' });
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

