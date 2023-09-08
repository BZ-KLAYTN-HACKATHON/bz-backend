const holyService = require('../services/holy-order.service.js');

exports.getOrders = async (req, res) => {
  try {
    const orders = await holyService.getOpenOrders();
    res.send({ data: orders });
  } catch (e) {
    res.status(400).send()
  }
};

