const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/authUser', userController.authUser);
router.post('/createUser', userController.createUser);
router.get('/getUserDetails/:id', userController.getUserDetails);
router.get('/getUserProgress/:userId', userController.getUserProgress);
router.get('/getCompletedCourses/:userId', userController.getCompletedCourses);

// delete users
router.delete('/adminDeleteUsers', userController.adminDeleteUsers);

module.exports = router;
