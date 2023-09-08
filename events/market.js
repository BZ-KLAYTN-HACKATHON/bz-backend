const orderController = require('../api/services/order.service.js');
const transactionController = require('../api/transactions/transaction.service.js');
const config = require('../config');

console.log('RPC', config.rpc);

const Web3 = require('web3');

// Subscribe HeroMarket's events on-chain
const web3 = new Web3(config.rpc);

async function onPlaceOrder (event) {
  const { nftAddress, tokenId, seller, price, orderId } = event.returnValues;
  const { blockNumber } = event;
  const newOrder = { orderId, nftAddress, tokenId, price, seller, blockNumber };
  return Promise.all([
    orderController.placeOrder(orderId, { ...newOrder, orderStatus: 'Open' }),
    transactionController.placeOrder(orderId, { ...newOrder, orderStatus: 'Open' })
  ]);
}

async function onUpdatePrice (event) {
  const { newPrice, orderId } = event.returnValues;
  return Promise.all([
    orderController.updatePrice(orderId, newPrice),
    transactionController.updatePrice(orderId, newPrice)
  ]);
}

async function onFillOrder (event) {
  const blockNumber = event.blockNumber
  const transactionHash = event.transactionHash;
  const { from: sender } = await web3.eth.getTransaction(transactionHash);
  const { orderId } = event.returnValues;
  return Promise.all([
    orderController.fillOrder(orderId),
    transactionController.fillOrder(orderId, sender, blockNumber, transactionHash),
  ])
}

async function onCancelOrder (event) {
  const { orderId } = event.returnValues;
  return Promise.all([
    orderController.cancelOrder(orderId),
    transactionController.cancelOrder(orderId)
  ]);
}

exports.onPlaceOrder = onPlaceOrder;
exports.onFillOrder = onFillOrder;
exports.onCancelOrder = onCancelOrder;
exports.onUpdatePrice = onUpdatePrice;
