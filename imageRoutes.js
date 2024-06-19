const express = require('express');
const imageController = require('../controllers/imageController');

const router = express.Router();

router.get('/', imageController.getImages);
router.post('/choice', imageController.recordChoice);

module.exports = router;
