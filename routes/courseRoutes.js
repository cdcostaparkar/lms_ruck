const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.post('/createCourse', courseController.createCourse);
router.get('/getAllCourses', courseController.getAllCourses);
router.get('/getUserCourses/:userId', courseController.getUserCourses);
router.patch('/updateCourse/:courseId', courseController.updateCourse);
router.patch('/deleteCourse/:courseId', courseController.deleteCourse);
router.get('/getTrainerCourses/:trainerId', courseController.getTrainerCourses);

module.exports = router;
