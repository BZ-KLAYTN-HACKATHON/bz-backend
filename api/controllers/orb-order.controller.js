const orbService = require('../services/orb-order.service.js');

exports.getOrders = async (req, res) => {
  try {
    const orders = await orbService.getOpenOrders();
    res.send({ data: orders });
  } catch (e) {
    res.status(400).send()
  }
};

