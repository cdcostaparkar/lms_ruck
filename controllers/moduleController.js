const Module = require('../models/Module');
const Course = require('../models/Course')

// Get Modules
exports.getModules = async (req, res) => {
    try {
        console.log(req.params.courseId);
        const modules = await Module.find({ course_id: req.params.courseId });
        res.json(modules);
    } catch (error) {
        res.status(404).json({ error: 'Modules not found' });
    }
};

exports.createModule = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, video_url, content, module_order, duration } = req.body;

        const course = await Course.findById(courseId);
        // console.log(course);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Create a new module instance
        const newModule = new Module({
            course_id: courseId,
            title,
            description,
            video_url: video_url || null, // Default to null if not provided
            content,
            module_order,
            duration
        });

        // Save the module to the database
        const savedModule = await newModule.save();

        // Respond with the created module
        res.status(201).json({
            message: 'Module created successfully',
            module: savedModule
        });
    } catch (error) {
        res.status(500).json({ error: 'Error creating module' });
    }
};

// Get Module Detail ~ individual
exports.getModuleDetail = async (req, res) => {
    try {
        const module = await Module.findById(req.params.moduleId);
        res.json(module);
    } catch (error) {
        res.status(404).json({ error: 'Module not found' });
    }
};

// Get Module Detail ~ All
exports.getAllModuleDetail = async (req, res) => {
    try {
        const { courseId } = req.params;
        const modules = await Module.find({ course_id: courseId });
        res.json(modules);
    } catch (error) {
        res.status(404).json({ error: 'Modules not found' });
    }
};

exports.updateModule = async (req, res) => {
    try {
        // Define the allowed fields
        const allowedFields = [
            'title',
            'description',
            'video_url',
            'content',
            'duration'
        ];

        // Check for disallowed fields in the request body
        const disallowedFields = Object.keys(req.body).filter(
            key => !allowedFields.includes(key)
        );

        if (disallowedFields.length > 0) {
            return res.status(400).json({
                error: `Disallowed fields: ${disallowedFields.join(', ')}`
            });
        }

        // Create a new object with only the allowed fields
        const updateData = Object.keys(req.body)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = req.body[key];
                return obj;
            }, {});

        const module = await Module.findByIdAndUpdate(
            req.params.moduleId,
            updateData,
            { new: true }
        );

        if (!module) {
            return res.status(404).json({ error: 'Module not found' });
        }

        res.json(module);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/* Admin APIs (for now) */

// Get all Modules
exports.getAllModules = async (req, res) => {
    try {
        const modules = await Module.find();
        res.json(modules);
    } catch (error) {
        res.status(404).json({ error: 'Modules not found' });
    }
};

// Delete all Modules
exports.deleteAllModules = async (req, res) => {
    try {
        const result = await Module.deleteMany({});
        res.json({ message: 'All modules deleted successfully', deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting all modules' });
    }
};

// Delete Modules by Course ID
exports.deleteModulesByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;
        const result = await Module.deleteMany({ course_id: courseId });
        res.json({ message: 'Modules deleted successfully', deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting modules' });
    }
};

// Delete Module by ID
exports.deleteModuleById = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const result = await Module.findByIdAndDelete(moduleId);
        if (!result) {
            return res.status(404).json({ error: 'Module not found' });
        }
        res.json({ message: 'Module deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting module' });
    }
};