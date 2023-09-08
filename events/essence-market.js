const essenceOrderController = require('../api/controllers/essence-order.controller.js');
const essenceTransactionController = require('../api/controllers/essence-transaction.controller.js');

exports.onPlaceOrder = async function onPlaceOrder (event) {
  const { nftAddress, tokenId, seller, price, orderId } = event.returnValues;
  const { blockNumber } = event;
  const newOrder = { orderId, nftAddress, tokenId, price, seller, blockNumber };
  return Promise.all([
    essenceOrderController.placeOrder(orderId, { ...newOrder, orderStatus: 'Open' }),
    essenceTransactionController.placeOrder(orderId, { ...newOrder, orderStatus: 'Open' })
  ]);
};

exports.onUpdatePrice = async function onUpdatePrice (event) {
  const { orderId, newPrice } = event.returnValues;
  return Promise.all([
    essenceOrderController.updatePrice(orderId, newPrice),
    essenceTransactionController.updatePrice(orderId, newPrice)
  ]);
};

exports.onFillOrder = async function onFillOrder (event) {
  const blockNumber = event.blockNumber
  const transactionHash = event.transactionHash;
  const { orderId, buyer } = event.returnValues;
  return Promise.all([
    essenceOrderController.fillOrder(orderId),
    essenceTransactionController.fillOrder(orderId, buyer, blockNumber, transactionHash)
  ]);
};

exports.onCancelOrder = async function onCancelOrder (event) {
  const { orderId } = event.returnValues;
  return Promise.all([
    essenceOrderController.cancelOrder(orderId),
    essenceTransactionController.cancelOrder(orderId)
  ]);
};
