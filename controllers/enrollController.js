// controllers/enrollController.js
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const Module = require('../models/Module');
const ModuleCompletion = require('../models/ModuleCompletion');


const User = require('../models/User');
const Wishlist = require('../models/Wishlist');

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

// Get all enrolled courses for a user with wishlist status
exports.getAllEnrolledCourses = async (req, res) => {
    const { userId } = req.params;

    try {
        // Step 1: Get all course IDs from the wishlist
        const wishlists = await Wishlist.find({ user_id: userId }).select(
            'course_id'
        );

        const wishlistedCourseIds = new Set(
            wishlists.map((wishlist) => wishlist.course_id.toString())
        );

        // Step 2: Get all enrolled courses
        const enrollments = await Enrollment.find({
            student_id: userId,
            isDeleted: false,
        }).populate({
            path: 'course_id',
            match: { isDeleted: false },
            select: 'title description trainer_id _id imageUrl',
            populate: {
                path: 'trainer_id',
                select: 'name', // Select only the name of the trainer
            },
        });

        const courses = await Promise.all(
            enrollments.map(async (enrollment) => {
                if (!enrollment.course_id) {
                    // Handle the case where course_id is null
                    return null; // Or return a default object, or throw an error, depending on your needs
                }

                const course = enrollment.course_id;

                const modules = await Module.find({ course_id: course._id });
                const duration = modules.reduce(
                    (sum, module) => sum + module.duration,
                    0
                );

                const moduleCompletion = await ModuleCompletion.find({
                    enrollment_id: enrollment._id,
                });

                let completionStatus = 0; // Default status if no module completions

                if (moduleCompletion.length > 0) {
                    const totalPercentage = moduleCompletion.reduce(
                        (sum, completion) => sum + completion.percentage,
                        0
                    );
                    completionPercentage =
                        (totalPercentage / moduleCompletion.length) * 100; // Calculate average and round to nearest integer
                    completionStatus = Math.round(completionPercentage);
                }

                const { ...courseData } = course.toObject();

                return {
                    ...courseData,
                    enrollment,
                    isWishlisted: wishlistedCourseIds.has(course._id.toString()), // Check if the course is wishlisted
                    completionStatus, // Add the completion status to the response
                    duration,
                };
            })
        );
        // Filter out any courses that are null (deleted) or that returned null from the map
        const filteredCourses = courses.filter(
            (course) => course && course.enrollment.course_id !== null
        );

        res.status(200).json(filteredCourses);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching courses',
            error,
        });
    }
};

// Get all courses where the user is not enrolled with wishlist status
exports.getAllNotEnrolledCourses = async (req, res) => {
    const { userId } = req.params;

    try {
        // Step 1: Get all course IDs from the wishlist
        const wishlists = await Wishlist.find({ user_id: userId }).select(
            'course_id'
        );

        const wishlistedCourseIds = new Set(
            wishlists.map((wishlist) => wishlist.course_id.toString())
        );

        // Step 2: Get all course IDs the user is enrolled in
        const enrollments = await Enrollment.find({
            student_id: userId,
            isDeleted: false,
        }).select('course_id');

        const enrolledCourseIds = enrollments.map(
            (enrollment) => enrollment.course_id
        );

        // Step 3: Get all courses and filter out the enrolled ones
        const coursesNotEnrolled = await Course.find({
            _id: { $nin: enrolledCourseIds },
            isDeleted: false, // Ensure we only get non-deleted courses
        }).populate('trainer_id', 'name'); // Populate trainer's name

        // Step 4: Add wishlist status to the courses
        const coursesWithWishlistStatus = await Promise.all(
            coursesNotEnrolled.map(async (course) => {
                const modules = await Module.find({ course_id: course._id });
                const duration = modules.reduce(
                    (sum, module) => sum + module.duration,
                    0
                );

                const { ...courseData } = course.toObject();

                return {
                    ...courseData, // Convert to plain object
                    isWishlisted: wishlistedCourseIds.has(course._id.toString()), // Check if the course is wishlisted
                    duration,
                };
            })
        );

        res.status(200).json(coursesWithWishlistStatus);
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
exports.deleteAllEnrollmentsAndProgress = async (req, res) => {
    try {
        // Delete all progress records
        await Progress.deleteMany({});

        // Delete all enrollments
        const result = await Enrollment.deleteMany({});

        res.status(200).json({ message: 'All enrollments and related progress deleted permanently', result });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting all enrollments and progress', error });
    }
};

exports.deleteAllEnrollmentsAndProgressStudent = async (req, res) => {
    try {
        const { userId } = req.params;
        // Delete all progress records
        await Progress.deleteMany({});

        // Delete all enrollments
        const result = await Enrollment.deleteMany({
            student_id: userId
        });

        res.status(200).json({ message: 'All enrollments and related progress deleted permanently', result });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting all enrollments and progress', error });
    }
};

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





// Enroll with Completion creation
// V1
// exports.enrollCourse = async (req, res) => {
//     const {
//       userId,
//       courseId
//     } = req.params;

//     try {
//       // Check if the user is already enrolled in the course
//       const existingEnrollment = await Enrollment.findOne({
//         student_id: userId,
//         course_id: courseId,
//         isDeleted: false, // Ensure we only check active enrollments
//       });

//       if (existingEnrollment) {
//         return res
//           .status(400)
//           .json({
//             message: "User is already enrolled in this course.",
//           });
//       }

//       // Create enrollment record
//       const enrollment = await Enrollment.create({
//         student_id: userId,
//         course_id: courseId,
//       });

//       // Find all modules for the course
//       const modules = await Module.find({
//         course_id: courseId
//       });

//       // Create module completion records for each module
//       const moduleCompletions = modules.map((module) => ({
//         enrollment_id: enrollment._id,
//         course_id: courseId,
//         module_id: module._id,
//       }));

//       await ModuleCompletion.insertMany(moduleCompletions);

//       res.status(201).json({
//         message: "Enrollment successful",
//         enrollment
//       });
//     } catch (error) {
//       res
//         .status(500)
//         .json({
//           message: "Error enrolling in course",
//           error
//         });
//     }
//   };


// V2 - Transactions
const mongoose = require('mongoose');

exports.enrollCoursev2T = async (req, res) => {
    const {
        userId,
        courseId
    } = req.params;

    const session = await mongoose.startSession(); // Start a session for the transaction
    session.startTransaction(); // Start the transaction

    try {
        // Check if the user is already enrolled in the course
        const existingEnrollment = await Enrollment.findOne({
            student_id: userId,
            course_id: courseId,
            isDeleted: false, // Ensure we only check active enrollments
        }).session(session); // Associate the query with the session

        if (existingEnrollment) {
            await session.abortTransaction(); // Rollback the transaction
            session.endSession(); // End the session
            return res
                .status(400)
                .json({
                    message: "User is already enrolled in this course.",
                });
        }

        // Create enrollment record
        const enrollment = await Enrollment.create([{
            student_id: userId,
            course_id: courseId,
        }], {
            session
        }); // Pass the session to the create operation

        // Find all modules for the course
        const modules = await Module.find({
            course_id: courseId
        }).session(session); // Associate the query with the session

        // console.log("e",enrollment);

        // Create module completion records for each module
        const moduleCompletions = modules.map((module) => ({
            enrollment_id: enrollment[0]._id, // Access the first element of the array
            course_id: courseId,
            module_id: module._id,
        }));

        await ModuleCompletion.insertMany(moduleCompletions, {
            session
        }); // Pass the session to the insertMany operation

        await session.commitTransaction(); // Commit the transaction
        session.endSession(); // End the session

        res.status(201).json({
            message: "Enrollment successful",
            enrollment: enrollment[0] // Access the first element of the array
        });
    } catch (error) {
        await session.abortTransaction(); // Rollback the transaction
        session.endSession(); // End the session
        res
            .status(500)
            .json({
                message: "Error enrolling in course",
                error
            });
    }
};
