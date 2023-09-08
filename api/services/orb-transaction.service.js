const OrbTransaction = require('../models/orb-transaction.model.js');
const peGameService = require('../services/plant-empire.js');

exports.placeOrder = async (orderId, order) => {
  const orderFound = await OrbTransaction.findOneAndUpdate({ orderId: orderId }, order, { upsert: true });
  if (!orderFound) {
    const { data: nft } = await peGameService.getOrbInfoById(order.tokenId);
    return OrbTransaction.updateOne({ orderId: orderId }, { nft: nft });
  }
  if (orderFound.orderStatus === 'Filled') {
    return orderFound.updateOne({ orderId: order.orderId }, orderFound);
  } else if (order.orderStatus === 'Cancelled') {
    return orderFound.updateOne({ orderId: order.orderId }, orderFound);
  }
};

exports.updatePrice = async (orderId, price) => {
  return OrbTransaction.findOneAndUpdate({ orderId: orderId }, { orderId, price }, { upsert: true });
};

exports.cancelOrder = async (orderId) => {
  return OrbTransaction.findOneAndUpdate(
    { orderId: orderId },
    { orderStatus: 'Cancelled', orderId },
    { upsert: true }
  );
};

exports.fillOrder = async (orderId, buyer, blockNumber, transactionHash) => {
  return OrbTransaction.findOneAndUpdate(
    { orderId: orderId },
    { orderStatus: 'Filled', buyer, blockNumber, orderId, transactionHash },
    { upsert: true }
  );
};

exports.countFilledOrder = async (fromBlock, toBlock) => {
  const query = {blockNumber: { $gte: fromBlock, $lte: toBlock}, orderStatus: 'Filled'}
  return OrbTransaction.count(query)
}

exports.getFilledOrder = async (fromBlock, toBlock) => {
  const query = {blockNumber: { $gte: fromBlock, $lte: toBlock}, orderStatus: 'Filled'}
  return OrbTransaction.find(query).select("price").lean();
}

exports.getTransaction = async (condition, page) => {
  const options = {
    page: page,
    limit: 10,
    sort: { blockNumber: -1 },
  };
  return OrbTransaction.paginate(condition, options)
}