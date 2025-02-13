const express = require('express');
const router = express.Router();
const moduleCompletionController = require('../controllers/moduleCompletionController');

router.post('/getModuleCompletionRecords', moduleCompletionController.getModuleCompletionRecords);
router.patch('/updateModulePercentage', moduleCompletionController.updateModulePercentage);

// Admin APIs
router.get('/getAllModuleCompletion', moduleCompletionController.getAllModuleCompletion);


module.exports = router;