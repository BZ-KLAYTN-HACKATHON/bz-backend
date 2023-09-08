const orderService = require('../services/order.service.js');
const { validationResult } = require('express-validator');

exports.getOrders = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
    }
    const { page, sort } = req.query;
    let condition = {
      orderStatus: "Open"
    };

    const orders = await orderService.findWithPagination(condition, sort && sort.replace(',', ' '), page);
    res.send({ data: orders });
  } catch (e) {
    res.status(400).send()
  }
};

exports.getOrderByOrderId = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
    }
    const { orderId } = req.params;

    const order = await orderService.findByOrderId(orderId);
    res.send({ data: order });
  } catch (e) {
    res.status(400).send()
  }
};

