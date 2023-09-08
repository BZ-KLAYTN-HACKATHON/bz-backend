const Order = require('../models/order.model.js');
const config = require('../../config/index.js');
const Item = require('../item/item.model.js');

exports.placeOrder = async (orderId, order) => {
  const orderFound = await Order.findOneAndUpdate({ orderId: orderId }, order, { upsert: true });
  if (!orderFound) {
    const nft = await Item.findOne({ nftId: order.tokenId });
    await Item.updateOne({ nftId: order.tokenId }, { price: order.price, orderId: orderId });
    return Order.updateOne({ orderId: orderId }, { nft: nft });
  }
  if (orderFound.orderStatus === 'Filled') {
    return orderFound.updateOne({ orderId: order.orderId }, orderFound);
  } else if (order.orderStatus === 'Cancelled') {
    return orderFound.updateOne({ orderId: order.orderId }, orderFound);
  }
};

exports.updatePrice = async (orderId, price) => {
  const order =  await Order.findOneAndUpdate({ orderId: orderId }, { orderId, price }, { upsert: true });
  await Item.updateOne({ nftId: order.tokenId }, { price: price, orderId: orderId });
  return order
};

exports.cancelOrder = async (orderId) => {
  return Order.findOneAndUpdate(
    { orderId: orderId },
    { orderStatus: 'Cancelled', orderId },
    { upsert: true }
  );
};

exports.fillOrder = async (orderId) => {
  const order = await Order.findOneAndUpdate({ orderId: orderId }, { orderStatus: 'Filled', orderId }, { upsert: true });
  await Item.updateOne({ nftId: order.tokenId, price: null, orderId: null });
  return order
};

exports.findWithPagination = async (condition, sort, page) => {
  const options = {
    page: page,
    limit: 20,
    lean: true,
    sort: { updatedAt: -1, ...sort },
  };
  return Order.paginate(condition, options);
};


exports.getOpenOrders = async () => {
  return Order.find({
    orderStatus: 'Open'
  });
}

exports.findByOrderId = async (orderId) => {
  return Order.findOne({ orderId });
}
