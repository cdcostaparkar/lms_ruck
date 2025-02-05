const Role = require('../models/Role');

// Create Role - createRole
exports.createRole = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Get All Roles - getAllRole
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
};



// Delete a specific role - deleteRole
exports.deleteRole = async (req, res) => {
    try {
        const roleId = req.params.id; // Get the role ID from the request parameters

        // Delete the role by ID
        const result = await Role.findByIdAndDelete(roleId);

        if (!result) {
            return res.status(404).json({ error: 'Role not found' });
        }

        res.json({ message: 'Role deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

