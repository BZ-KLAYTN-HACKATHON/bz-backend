const LGNftOrder = require('../models/pe-hero-order.model.js');

const config = require('../../config');

exports.getOrders = async (req, res) => {
  try {
    const orders = await LGNftOrder.find({
      nftAddress: config.NFT_ADDRESS,
      orderStatus: 'Open'
    });
    res.send({ data: orders });
  } catch (e) {
    res.status(400).send()
  }
};

