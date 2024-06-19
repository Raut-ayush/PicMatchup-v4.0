const express = require('express');
const userController = require('../controllers/userController');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.post('/delete', adminAuth, userController.deleteUser);

module.exports = router;
