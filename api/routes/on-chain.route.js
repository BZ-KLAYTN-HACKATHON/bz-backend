const express = require('express');
const controller = require('../controllers/on-chain.controller.js');

const router = express.Router();

router
  .route('/hero/:tokenId')
  .get(controller.getHero)

router
  .route('/legend-guardian/:tokenId')
  .get(controller.getLegendGuardianHero)

module.exports = router;

