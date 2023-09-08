const PieceTransaction = require('./transaction.model.js');
const Piece = require('../item/item.model.js');

exports.placeOrder = async (orderId, order) => {
  const orderFound = await PieceTransaction.findOneAndUpdate({ orderId: orderId }, order, { upsert: true });
  if (!orderFound) {
    const nft = await Piece.findOne({ nftAddress: order.nftAddress, tokenId: order.tokenId });
    return PieceTransaction.updateOne({ orderId: orderId }, { nft: nft });
  }
  if (orderFound.orderStatus === 'Filled') {
    return orderFound.updateOne({ orderId: order.orderId }, orderFound);
  } else if (order.orderStatus === 'Cancelled') {
    return orderFound.updateOne({ orderId: order.orderId }, orderFound);
  }
};

exports.updatePrice = async (orderId, price) => {
  return PieceTransaction.findOneAndUpdate({ orderId: orderId }, { orderId, price }, { upsert: true });
};

exports.cancelOrder = async (orderId) => {
  return PieceTransaction.findOneAndUpdate(
    { orderId: orderId },
    { orderStatus: 'Cancelled', orderId },
    { upsert: true }
  );
};

exports.fillOrder = async (orderId, buyer, blockNumber, transactionHash) => {
  return PieceTransaction.findOneAndUpdate(
    { orderId: orderId },
    { orderStatus: 'Filled', buyer, blockNumber, orderId, transactionHash },
    { upsert: true }
  );
};

exports.countFilledOrder = async (fromBlock, toBlock) => {
  const query = {blockNumber: { $gte: fromBlock, $lte: toBlock}, orderStatus: 'Filled'}
  return PieceTransaction.count(query)
}

exports.getFilledOrder = async (fromBlock, toBlock) => {
  const query = {blockNumber: { $gte: fromBlock, $lte: toBlock}, orderStatus: 'Filled'}
  return PieceTransaction.find(query).select("price").lean();
}

exports.getTransaction = async (condition, page) => {
  const options = {
    page: page,
    limit: 10,
    sort: { blockNumber: -1 },
  };
  return PieceTransaction.paginate(condition, options)
}
