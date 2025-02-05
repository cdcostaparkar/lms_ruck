const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.post('/createCourse/:userId', courseController.createCourse);
router.get('/getAllCourses', courseController.getAllCourses);

// router.patch('/updateCourse/:courseId', courseController.updateCourse);
router.patch('/updateCourse/:courseId?userId=:userId', courseController.updateCourse);

router.patch('/deleteCourse/:courseId', courseController.deleteCourse);
router.get('/getTrainerCourses/:trainerId', courseController.getTrainerCourses);

// enrollment table required
router.get('/getUserCourses/:userId', courseController.getUserCourses);

module.exports = router;
