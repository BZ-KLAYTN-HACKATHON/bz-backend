const PEHeroOrder = require('../models/pe-hero-order.model.js');
const PEHero = require('../models/plant-empire-nft.model.js');

exports.placeOrder = async (orderId, order) => {
  const orderFound = await PEHeroOrder.findOneAndUpdate({ orderId: orderId }, order, { upsert: true });
  if (!orderFound) {
    const nft = await PEHero.findOne({ nftAddress: order.nftAddress, tokenId: order.tokenId });
    return PEHeroOrder.updateOne({ orderId: orderId }, { nft: nft });
  }
  if (orderFound.orderStatus === 'Filled') {
    return orderFound.updateOne({ orderId: order.orderId }, orderFound);
  } else if (order.orderStatus === 'Cancelled') {
    return orderFound.updateOne({ orderId: order.orderId }, orderFound);
  }
};

exports.updatePrice = async (orderId, price) => {
  return PEHeroOrder.findOneAndUpdate({ orderId: orderId }, { orderId, price }, { upsert: true });
};

exports.cancelOrder = async (orderId) => {
  return PEHeroOrder.findOneAndUpdate(
    { orderId: orderId },
    { orderStatus: 'Cancelled', orderId },
    { upsert: true }
  );
};

exports.fillOrder = async (orderId) => {
  return PEHeroOrder.findOneAndUpdate({ orderId: orderId }, { orderStatus: 'Filled', orderId }, { upsert: true });
};

exports.updateDetailForHero = async (tokenId, detail) => {
  return PEHeroOrder.updateMany({ tokenId: tokenId }, { 'nft.detail': detail });
};

exports.findByOrderId = async (orderId) => {
  return PEHeroOrder.findOne({ orderId });
}
