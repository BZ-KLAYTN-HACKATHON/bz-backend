const peHeroOrderService = require('../api/services/piece-order.service.js');
const peHeroTransactionService = require('../api/services/piece-transaction.service.js');

exports.onPlaceOrder = async function onPlaceOrder (event) {
  const { nftAddress, tokenId, seller, price, orderId } = event.returnValues;
  const { blockNumber } = event;
  const newOrder = { orderId, nftAddress, tokenId, price, seller, blockNumber };
  return Promise.all([
    peHeroOrderService.placeOrder(orderId, { ...newOrder, orderStatus: 'Open' }),
    peHeroTransactionService.placeOrder(orderId, { ...newOrder, orderStatus: 'Open' })
  ]);
};

exports.onUpdatePrice = async function onUpdatePrice (event) {
  const { orderId, newPrice } = event.returnValues;
  return Promise.all([
    peHeroOrderService.updatePrice(orderId, newPrice),
    peHeroTransactionService.updatePrice(orderId, newPrice)
  ]);
};

exports.onFillOrder = async function onFillOrder (event) {
  const blockNumber = event.blockNumber
  const transactionHash = event.transactionHash;
  const { orderId, buyer, tokenId } = event.returnValues;
  return Promise.all([
    peHeroOrderService.fillOrder(orderId),
    peHeroTransactionService.fillOrder(orderId, buyer, blockNumber, transactionHash)
  ]);
};

exports.onCancelOrder = async function onCancelOrder (event) {
  const { orderId } = event.returnValues;
  return Promise.all([
    peHeroOrderService.cancelOrder(orderId),
    peHeroTransactionService.cancelOrder(orderId)
  ]);
};
