const express = require('express');
const someController = require('../controllers/someController');
const auth = require('../middleware/auth');

const router = express.Router();

// Protect this route with the auth middleware
router.get('/protected-endpoint', auth, someController.someFunction);

module.exports = router;
