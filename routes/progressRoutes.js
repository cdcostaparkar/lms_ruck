const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

router.patch('/updateProgress/:userId/:enrollmentId',progressController.updateProgress);
router.get('/getProgress', progressController.getProgress)

module.exports = router;