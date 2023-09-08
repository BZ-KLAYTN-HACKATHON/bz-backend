const express = require('express');
const controller = require('../controllers/holy-order.controller.js');

const router = express.Router();

router
  .route('/')
  .get(controller.getOrders)

module.exports = router;
