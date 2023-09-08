const express = require('express');
const controller = require('../controllers/pe-hero-order.controller.js');

const router = express.Router();

router
  .route('/')
  .get(controller.getOrders)

module.exports = router;
