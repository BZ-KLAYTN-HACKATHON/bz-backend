const HolyTransaction = require('../models/holy-transaction.model.js');
const Holy = require('../models/holy.model.js');

exports.placeOrder = async (orderId, order) => {
  const orderFound = await HolyTransaction.findOneAndUpdate({ orderId: orderId }, order, { upsert: true });
  if (!orderFound) {
    const nft = await Holy.findOne({ nftAddress: order.nftAddress, tokenId: order.tokenId });
    return HolyTransaction.updateOne({ orderId: orderId }, { nft: nft });
  }
  if (orderFound.orderStatus === 'Filled') {
    return orderFound.updateOne({ orderId: order.orderId }, orderFound);
  } else if (order.orderStatus === 'Cancelled') {
    return orderFound.updateOne({ orderId: order.orderId }, orderFound);
  }
};

exports.updatePrice = async (orderId, price) => {
  return HolyTransaction.findOneAndUpdate({ orderId: orderId }, { orderId, price }, { upsert: true });
};

exports.cancelOrder = async (orderId) => {
  return HolyTransaction.findOneAndUpdate(
    { orderId: orderId },
    { orderStatus: 'Cancelled', orderId },
    { upsert: true }
  );
};

exports.fillOrder = async (orderId, buyer, blockNumber, transactionHash) => {
  return HolyTransaction.findOneAndUpdate(
    { orderId: orderId },
    { orderStatus: 'Filled', buyer, blockNumber, orderId, transactionHash },
    { upsert: true }
  );
};

exports.countFilledOrder = async (fromBlock, toBlock) => {
  const query = {blockNumber: { $gte: fromBlock, $lte: toBlock}, orderStatus: 'Filled'}
  return HolyTransaction.count(query)
}

exports.getFilledOrder = async (fromBlock, toBlock) => {
  const query = {blockNumber: { $gte: fromBlock, $lte: toBlock}, orderStatus: 'Filled'}
  return HolyTransaction.find(query).select("price").lean();
}

exports.getTransaction = async (condition, page) => {
  const options = {
    page: page,
    limit: 10,
    sort: { blockNumber: -1 },
  };
  return HolyTransaction.paginate(condition, options)
}