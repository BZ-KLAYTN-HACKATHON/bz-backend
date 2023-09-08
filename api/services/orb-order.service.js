const OrbOrder = require('../models/orb-order.model.js');
const peGameService = require('../services/plant-empire.js');
const config = require('../../config/index.js');

exports.placeOrder = async (orderId, order) => {
  const orderFound = await OrbOrder.findOneAndUpdate({ orderId: orderId }, order, { upsert: true });
  if (!orderFound) {
    const { data: nft } = await peGameService.getOrbInfoById(order.tokenId);
    return OrbOrder.updateOne({ orderId: orderId }, { nft: nft });
  }
  if (orderFound.orderStatus === 'Filled') {
    return orderFound.updateOne({ orderId: order.orderId }, orderFound);
  } else if (order.orderStatus === 'Cancelled') {
    return orderFound.updateOne({ orderId: order.orderId }, orderFound);
  }
};

exports.updatePrice = async (orderId, price) => {
  return OrbOrder.findOneAndUpdate({ orderId: orderId }, { orderId, price }, { upsert: true });
};

exports.cancelOrder = async (orderId) => {
  return OrbOrder.findOneAndUpdate(
    { orderId: orderId },
    { orderStatus: 'Cancelled', orderId },
    { upsert: true }
  );
};

exports.fillOrder = async (orderId) => {
  return OrbOrder.findOneAndUpdate({ orderId: orderId }, { orderStatus: 'Filled', orderId }, { upsert: true });
};

exports.updateDetailForHero = async (tokenId, detail) => {
  return OrbOrder.updateMany({ tokenId: tokenId }, { 'nft.detail': detail });
};

exports.getOpenOrders = async () => {
  return OrbOrder.find({
    nftAddress: config.CONTRACTS.ORB_NFT,
    orderStatus: 'Open'
  });
}

exports.findByOrderId = async (orderId) => {
  return OrbOrder.findOne({ orderId });
}
