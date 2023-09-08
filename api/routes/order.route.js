const express = require('express');
const controller = require('../controllers/order.controller.js');

const router = express.Router();

router
  .route('/public/orders')
  .get(controller.getOrders)

router
  .route('/public/orders/:orderId')
  .get(controller.getOrderByOrderId)

module.exports = router;
