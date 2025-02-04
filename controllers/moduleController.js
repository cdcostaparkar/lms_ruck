const Module = require('../models/Module');

// Get Modules
exports.getModules = async (req, res) => {
    try {
        const modules = await Module.find({ course_id: req.params.courseId });
        res.json(modules);
    } catch (error) {
        res.status(404).json({ error: 'Modules not found' });
    }
};

// Get Module Detail
exports.getModuleDetail = async (req, res) => {
    try {
        const module = await Module.findById(req.params.moduleId);
        res.json(module);
    } catch (error) {
        res.status(404).json({ error: 'Module not found' });
    }
};

// Update Module
exports.updateModule = async (req, res) => {
    try {
        const module = await Module.findByIdAndUpdate(req.params.moduleId, req.body, { new: true });
        res.json(module);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
