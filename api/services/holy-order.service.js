const HolyOrder = require('../models/order.model.js');
const config = require('../../config/index.js');
const Holy = require('../models/holy.model.js');

exports.placeOrder = async (orderId, order) => {
  const orderFound = await HolyOrder.findOneAndUpdate({ orderId: orderId }, order, { upsert: true });
  if (!orderFound) {
    const nft = await Holy.findOne({ nftAddress: order.nftAddress, tokenId: order.tokenId });
    return HolyOrder.updateOne({ orderId: orderId }, { nft: nft });
  }
  if (orderFound.orderStatus === 'Filled') {
    return orderFound.updateOne({ orderId: order.orderId }, orderFound);
  } else if (order.orderStatus === 'Cancelled') {
    return orderFound.updateOne({ orderId: order.orderId }, orderFound);
  }
};

exports.updatePrice = async (orderId, price) => {
  return HolyOrder.findOneAndUpdate({ orderId: orderId }, { orderId, price }, { upsert: true });
};

exports.cancelOrder = async (orderId) => {
  return HolyOrder.findOneAndUpdate(
    { orderId: orderId },
    { orderStatus: 'Cancelled', orderId },
    { upsert: true }
  );
};

exports.fillOrder = async (orderId) => {
  return HolyOrder.findOneAndUpdate({ orderId: orderId }, { orderStatus: 'Filled', orderId }, { upsert: true });
};

exports.updateDetailForHero = async (tokenId, detail) => {
  return HolyOrder.updateMany({ tokenId: tokenId }, { 'nft.detail': detail });
};

exports.getOpenOrders = async () => {
  return HolyOrder.find({
    nftAddress: config.HOLY_ADDRESS,
    orderStatus: 'Open'
  });
}

exports.findByOrderId = async (orderId) => {
  return HolyOrder.findOne({ orderId });
}
