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
router.delete('/adminDeleteUserId/:userId', userController.adminDeleteUserId);

// otp
router.post('/resetPassword', userController.resetPassword);
router.get('/getUserByEmail', userController.getUserByEmail);



// get all users
router.get('/getAllUsers',userController.getAllUsers);

module.exports = router;
