const express = require('express');
const eloController = require('../controllers/eloController');

const router = express.Router();

router.get('/', eloController.getEloRatings);

module.exports = router;
