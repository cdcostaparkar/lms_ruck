const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

router.post('/createRole',roleController.createRole);
router.get('/getAllRoles', roleController.getAllRoles);
router.delete('/deleteRole/:id', roleController.deleteRole);


module.exports = router;