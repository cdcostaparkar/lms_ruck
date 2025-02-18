const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const multer = require('multer');

// Multer instance for createCourse (handles file upload)
const storage = multer.memoryStorage();
const uploadCreate = multer({ storage: storage });

// Multer instance for updateCourse (parses FormData, no file handling)
const uploadUpdate = multer();

router.post(
  '/createCourse/:userId',
  uploadCreate.single('image'),
  courseController.createCourse
);

router.get('/getAllCourses', courseController.getAllCourses);
router.get('/getAllCoursesX', courseController.getAllCoursesX);

router.patch(
  '/updateCourse/:courseId',
  uploadUpdate.none(),
  courseController.updateCourse
);
router.patch('/deleteCourse/:courseId', courseController.deleteCourse);

// trainer APIs
router.get('/getTrainerCourses/:userId', courseController.getTrainerCourses);
router.get('/getNotTrainerCourses/:userId', courseController.getNotTrainerCourses);

// enrollment table required
router.get('/getUserCourses/:userId', courseController.getUserCourses);

// Admin Delete
router.delete('/adminDeleteCourses', courseController.adminDeleteCourses);

module.exports = router;
