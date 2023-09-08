const PEHeroTransaction = require('../models/pe-hero-transaction.model.js');
const PEHero = require('../models/plant-empire-nft.model.js');

exports.updateNftAttributes = async (tokenId, agility, health, intelligence, precision, skills, name, sex) => {
  return PEHeroTransaction.updateMany(
    { tokenId },
    {
      'nft.agility': agility,
      'nft.health': health,
      'nft.intelligence': intelligence,
      'nft.precision': precision,
      'nft.skills': skills,
      'nft.name': name,
      'nft.sex': sex
    }
  );
};

exports.placeOrder = async (orderId, order) => {
  const orderFound = await PEHeroTransaction.findOneAndUpdate({ orderId: orderId }, order, { upsert: true });
  if (!orderFound) {
    const nft = await PEHero.findOne({ tokenId: order.tokenId });
    return PEHeroTransaction.updateOne({ orderId: orderId }, { nft: nft });
  }
  if (orderFound.orderStatus === 'Filled') {
    return orderFound.updateOne({ orderId: order.orderId }, orderFound);
  } else if (order.orderStatus === 'Cancelled') {
    return orderFound.updateOne({ orderId: order.orderId }, orderFound);
  }
};

exports.updatePrice = async (orderId, price) => {
  return PEHeroTransaction.findOneAndUpdate({ orderId: orderId }, { orderId, price }, { upsert: true });
};

exports.cancelOrder = async (orderId) => {
  return PEHeroTransaction.findOneAndUpdate(
    { orderId: orderId },
    { orderStatus: 'Cancelled', orderId },
    { upsert: true }
  );
};

exports.fillOrder = async (orderId, buyer, blockNumber, transactionHash) => {
  return PEHeroTransaction.findOneAndUpdate(
    { orderId: orderId },
    { orderStatus: 'Filled', buyer, blockNumber, orderId, transactionHash },
    { upsert: true }
  );
};

exports.countFilledOrder = async (fromBlock, toBlock) => {
  const query = {blockNumber: { $gte: fromBlock, $lte: toBlock}, orderStatus: 'Filled'}
  return PEHeroTransaction.count(query)
}

exports.getFilledOrder = async (fromBlock, toBlock) => {
  const query = {blockNumber: { $gte: fromBlock, $lte: toBlock}, orderStatus: 'Filled'}
  return PEHeroTransaction.find(query).select("price").lean();
}

exports.updateDetailForHero = async (tokenId, detail) => {
  return PEHeroTransaction.updateMany({ tokenId: tokenId }, { 'nft.detail': detail });
};
