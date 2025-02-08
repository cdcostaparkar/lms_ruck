// controllers/enrollController.js
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const User = require('../models/User');

// Enroll a student in a course(no check for role yet)
exports.enrollCourse = async (req, res) => {
    const { userId, courseId } = req.params;

    try {
        // Check if the user is already enrolled in the course
        const existingEnrollment = await Enrollment.findOne({
            student_id: userId,
            course_id: courseId,
            isDeleted: false // Ensure we only check active enrollments
        });

        if (existingEnrollment) {
            return res.status(400).json({ message: 'User is already enrolled in this course.' });
        }

        // Create enrollment record
        const enrollment = await Enrollment.create({
            student_id: userId,
            course_id: courseId
        });

        // Create progress record
        await Progress.create({
            enrollment_id: enrollment._id,
            status: 0 // Initial status
        });

        res.status(201).json({ message: 'Enrollment successful', enrollment });
    } catch (error) {
        res.status(500).json({ message: 'Error enrolling in course', error });
    }
};

// Get all enrolled courses for a user
exports.getAllEnrolledCourses = async (req, res) => {
    const { userId } = req.params;

    try {
        const enrollments = await Enrollment.find({
            student_id: userId,
            isDeleted: false
        }).populate({
            path: 'course_id',
            match: { isDeleted: false },
            populate: {
                path: 'trainer_id',
                select: 'name' // Select only the name of the trainer
            }
        });

        const courses = await Promise.all(
            enrollments.map(async (enrollment) => {
                const progress = await Progress.findOne({
                    enrollment_id: enrollment._id
                });

                return {
                    enrollment,
                    // course: {
                    //     ...enrollment.course_id.toObject(), // Convert to plain object
                    //     trainerName: enrollment.course_id.trainer_id.name // Add trainer's name
                    // },
                    progress: progress ? progress.status : null
                };
            })
        );

        // Filter out any courses that are null (deleted)
        const filteredCourses = courses.filter(course => course.enrollment.course_id !== null);

        res.status(200).json(filteredCourses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error });
    }
};

// Get all courses where the user is not enrolled
exports.getAllNotEnrolledCourses = async (req, res) => {
    const { userId } = req.params;

    try {
        // Step 1: Get all course IDs the user is enrolled in
        const enrollments = await Enrollment.find({
            student_id: userId,
            isDeleted: false
        }).select('course_id');

        const enrolledCourseIds = enrollments.map(enrollment => enrollment.course_id);

        // Step 2: Get all courses and filter out the enrolled ones
        const coursesNotEnrolled = await Course.find({
            _id: { $nin: enrolledCourseIds },
            isDeleted: false // Ensure we only get non-deleted courses
        }).populate('trainer_id', 'name'); // Populate trainer's name

        res.status(200).json(coursesNotEnrolled);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error });
    }
};


// Get all enrolled courses for a user (including soft deleted enrollments)
exports.getAllEnrolledCoursesX = async (req, res) => {
    const { userId } = req.params;

    try {
        const enrollments = await Enrollment.find({
            student_id: userId,
            // isDeleted: false
        }).populate('course_id');

        const courses = await Promise.all(
            enrollments.map(async (enrollment) => {
                const progress = await Progress.findOne({
                    enrollment_id: enrollment._id
                });

                return {
                    enrollment,
                    // course: enrollment.course_id,
                    progress: progress ? progress.status : null
                };
            })
        );

        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error });
    }
};

// Soft delete an enrollment
exports.deleteEnrollment = async (req, res) => {
    const { userId, enrollmentId } = req.params;

    try {
        // Find the enrollment by userId and enrollmentId
        const enrollment = await Enrollment.findOneAndUpdate(
            { _id: enrollmentId, student_id: userId, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found or already deleted' });
        }

        res.status(200).json({ message: 'Enrollment deleted successfully', enrollment });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting enrollment', error });
    }
};


/* Admin Test APIs */
// Get all progress from table
exports.getAllProgress = async (req, res) => {
    try {
        const progressRecords = await Progress.find();

        res.status(200).json(progressRecords);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching progress', error });
    }
};

// Delete all enrollments permanently
exports.deleteAllEnrollments = async (req, res) => {
    try {
        const result = await Enrollment.deleteMany({});

        res.status(200).json({ message: 'All enrollments deleted permanently', result });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting all enrollments', error });
    }
};