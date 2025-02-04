const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');

router.get('/getModules/:courseId', moduleController.getModules);
router.get('/getModuleDetail/:moduleId', moduleController.getModuleDetail);
router.patch('/updateModule/:moduleId', moduleController.updateModule);

module.exports = router;
