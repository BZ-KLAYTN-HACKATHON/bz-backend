const pieceService = require('../services/piece-order.service.js');

exports.getOrders = async (req, res) => {
  try {
    const orders = await pieceService.getOpenOrders();
    res.send({ data: orders });
  } catch (e) {
    res.status(400).send()
  }
};

