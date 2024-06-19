const express = require('express');
const resetController = require('../controllers/resetController');

const router = express.Router();

router.post('/', resetController.resetState);
router.post('/elo', resetController.resetElo);

module.exports = router;
