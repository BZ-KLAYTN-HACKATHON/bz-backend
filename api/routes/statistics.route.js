const express = require('express');
const controller = require('../controllers/statistics.controller.js');

const router = express.Router();

router
  .route('/heroes')
  .get(controller.getStatistics)

router
  .route('/orbs')
  .get(controller.getOrbStatistics)

router
  .route('/holies')
  .get(controller.getHolyStatistics)

router
  .route('/pieces')
  .get(controller.getPieceStatistics)

module.exports = router;
