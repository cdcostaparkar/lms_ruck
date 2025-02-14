const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const multer = require('multer');

const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

router.post(
  '/createCourse/:userId',
  upload.single('image'),
  courseController.createCourse
);

router.get('/getAllCourses', courseController.getAllCourses);
router.get('/getAllCoursesX', courseController.getAllCoursesX);

// router.patch('/updateCourse/:courseId', courseController.updateCourse);
router.patch('/updateCourse/:courseId', courseController.updateCourse);

router.patch('/deleteCourse/:courseId', courseController.deleteCourse);

// trainer APIs
router.get('/getTrainerCourses/:userId', courseController.getTrainerCourses);
router.get('/getNotTrainerCourses/:userId', courseController.getNotTrainerCourses);

// enrollment table required
router.get('/getUserCourses/:userId', courseController.getUserCourses);

// Admin Delete
router.delete('/adminDeleteCourses', courseController.adminDeleteCourses);

module.exports = router;
