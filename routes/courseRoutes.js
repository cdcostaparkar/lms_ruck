const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Course routes
router.post('/createCourse/:userId', upload.single('image'), courseController.createCourse);

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
