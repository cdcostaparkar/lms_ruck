const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');

router.get('/getModules/:courseId', moduleController.getModules);
router.get('/getAllModuleDetail/:courseId', moduleController.getAllModuleDetail);
router.patch('/updateModule/:moduleId', moduleController.updateModule);
router.post('/createModule/:courseId', moduleController.createModule);

// delete module by id
router.delete('/deleteModuleById/:moduleId', moduleController.deleteModuleById);

// Admin APIs
router.get('/getModuleDetail/:moduleId', moduleController.getModuleDetail); // efficient if big data
router.delete('/deleteAllModules', moduleController.deleteAllModules);
router.get('/getAllModules', moduleController.getAllModules);

module.exports = router;
