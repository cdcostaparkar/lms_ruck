// routes/enrollRoutes.js
const express = require('express');
const router = express.Router();
const enrollController = require('../controllers/enrollController');

router.post('/enrollCourse/:userId/:courseId', enrollController.enrollCourse);
router.get('/getAllEnrolledCourses/:userId', enrollController.getAllEnrolledCourses);
router.patch('/deleteEnrollment/:userId/:enrollmentId', enrollController.deleteEnrollment);
router.get('/getAllNotEnrolledCourses/:userId', enrollController.getAllNotEnrolledCourses);


// Admin APIs
router.get('/getAllProgress', enrollController.getAllProgress);
router.delete('/deleteAllEnrollments/:userId/:enrollmentId', enrollController.deleteAllEnrollments);
router.get('/getAllEnrolledCoursesX/:userId', enrollController.getAllEnrolledCoursesX);

module.exports = router;
