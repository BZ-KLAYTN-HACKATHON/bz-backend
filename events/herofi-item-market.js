const heroFiItemOrderService = require('../api/services/herofi/herofi-item-order.service.js');
const heroFiItemTransactionController = require('../api/controllers/herofi/herofi-item-transaction.controller.js');

exports.onPlaceOrder = async function onPlaceOrder (event) {
  const { nftAddress, tokenId, seller, price, orderId } = event.returnValues;
  const { blockNumber } = event;
  const newOrder = { orderId, nftAddress, tokenId, price, seller, blockNumber };
  return Promise.all([
    heroFiItemOrderService.placeOrder(orderId, { ...newOrder, orderStatus: 'Open' }),
    heroFiItemTransactionController.placeOrder(orderId, { ...newOrder, orderStatus: 'Open' })
  ]);
};

exports.onUpdatePrice = async function onUpdatePrice (event) {
  const { orderId, newPrice } = event.returnValues;
  return Promise.all([
    heroFiItemOrderService.updatePrice(orderId, newPrice),
    heroFiItemTransactionController.updatePrice(orderId, newPrice)
  ]);
};

exports.onFillOrder = async function onFillOrder (event) {
  const blockNumber = event.blockNumber
  const transactionHash = event.transactionHash;
  const { orderId, buyer } = event.returnValues;
  return Promise.all([
    heroFiItemOrderService.fillOrder(orderId),
    heroFiItemTransactionController.fillOrder(orderId, buyer, blockNumber, transactionHash)
  ]);
};

exports.onCancelOrder = async function onCancelOrder (event) {
  const { orderId } = event.returnValues;
  return Promise.all([
    heroFiItemOrderService.cancelOrder(orderId),
    heroFiItemTransactionController.cancelOrder(orderId)
  ]);
};
