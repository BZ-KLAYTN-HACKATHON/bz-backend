const PieceOrder = require('../models/piece-order.model.js');
const config = require('../../config/index.js');
const Piece = require('../models/chest-pieces.model.js');

exports.placeOrder = async (orderId, order) => {
  const orderFound = await PieceOrder.findOneAndUpdate({ orderId: orderId }, order, { upsert: true });
  if (!orderFound) {
    const nft = await Piece.findOne({ nftAddress: order.nftAddress, tokenId: order.tokenId });
    return PieceOrder.updateOne({ orderId: orderId }, { nft: nft });
  }
  if (orderFound.orderStatus === 'Filled') {
    return orderFound.updateOne({ orderId: order.orderId }, orderFound);
  } else if (order.orderStatus === 'Cancelled') {
    return orderFound.updateOne({ orderId: order.orderId }, orderFound);
  }
};

exports.updatePrice = async (orderId, price) => {
  return PieceOrder.findOneAndUpdate({ orderId: orderId }, { orderId, price }, { upsert: true });
};

exports.cancelOrder = async (orderId) => {
  return PieceOrder.findOneAndUpdate(
    { orderId: orderId },
    { orderStatus: 'Cancelled', orderId },
    { upsert: true }
  );
};

exports.fillOrder = async (orderId) => {
  return PieceOrder.findOneAndUpdate({ orderId: orderId }, { orderStatus: 'Filled', orderId }, { upsert: true });
};

exports.updateDetailForHero = async (tokenId, detail) => {
  return PieceOrder.updateMany({ tokenId: tokenId }, { 'nft.detail': detail });
};

exports.getOpenOrders = async () => {
  return PieceOrder.find({
    nftAddress: config.CONTRACTS.CHEST_PIECE,
    orderStatus: 'Open'
  });
}

exports.findByOrderId = async (orderId) => {
  return PieceOrder.findOne({ orderId });
}
