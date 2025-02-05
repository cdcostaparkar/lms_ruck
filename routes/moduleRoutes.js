const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');

router.get('/getModules/:courseId', moduleController.getModules);
router.get('/getModuleDetail/:courseId', moduleController.getModuleDetail);
router.patch('/updateModule/:courseId', moduleController.updateModule);

module.exports = router;
