const peHeroOrderService = require('../api/services/pe-hero-order.service.js');
const peHeroTransactionController = require('../api/services/pe-hero-transaction.service.js');
const peService = require('../api/services/plant-empire.js');

exports.onPlaceOrder = async function onPlaceOrder (event) {
  const { nftAddress, tokenId, seller, price, orderId } = event.returnValues;
  const { blockNumber } = event;
  const newOrder = { orderId, nftAddress, tokenId, price, seller, blockNumber };
  return Promise.all([
    peService.sellHero(tokenId),
    peHeroOrderService.placeOrder(orderId, { ...newOrder, orderStatus: 'Open' }),
    peHeroTransactionController.placeOrder(orderId, { ...newOrder, orderStatus: 'Open' })
  ]);
};

exports.onUpdatePrice = async function onUpdatePrice (event) {
  const { orderId, newPrice } = event.returnValues;
  return Promise.all([
    peHeroOrderService.updatePrice(orderId, newPrice),
    peHeroTransactionController.updatePrice(orderId, newPrice)
  ]);
};

exports.onFillOrder = async function onFillOrder (event) {
  const blockNumber = event.blockNumber
  const transactionHash = event.transactionHash;
  const { orderId, buyer, tokenId } = event.returnValues;
  return Promise.all([
    peService.stopSellHero(tokenId),
    peHeroOrderService.fillOrder(orderId),
    peHeroTransactionController.fillOrder(orderId, buyer, blockNumber, transactionHash)
  ]);
};

exports.onCancelOrder = async function onCancelOrder (event) {
  const { orderId, tokenId } = event.returnValues;
  return Promise.all([
    peService.stopSellHero(tokenId),
    peHeroOrderService.cancelOrder(orderId),
    peHeroTransactionController.cancelOrder(orderId)
  ]);
};
