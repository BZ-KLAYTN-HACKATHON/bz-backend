const orderBy = require('lodash/orderBy');
const zipWith = require('lodash/zipWith');
const versionController = require('../api/controllers/version.controller.js');
const itemService = require('../api/item/item.service.js');
const peOrderService = require('../api/services/pe-hero-order.service.js');
const peHeroMarketEventHandler = require('../events/market.js');
const referralService = require('../api/services/rofi-referral.js');
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const telegram = require('../bot/telegram.js');
const VERSION_ID = 2;
let EXIT_SIGNAL = false;

const config = require('../config/index.js');
const RPCs = config.rpc_options;
let SELECTED_RPC = { rpc: config.premium_rpc};

console.log('RPC', config.premium_rpc);

const Web3 = require('web3');

// Add Authorization if our own RPC Node
function getProvider (rpc) {
  const OUR_OWN_NODE = 'https://rpc-node-01.bravechain.net';
  if (rpc == OUR_OWN_NODE) {
    return new Web3.providers.HttpProvider(rpc, {
      headers: [
        {
          name: 'Authorization',
          value: 'Basic ZXRoOkpVYlVPWEMwb09RbUJ4WUs='
        }]
    });
  } else {
    return new Web3.providers.HttpProvider(rpc);
  }
}
const web3 = new Web3(getProvider(config.premium_rpc));

const ShopABI = require('../abis/PEShop.json');
const shopInstance = new web3.eth.Contract(ShopABI, config.CONTRACTS.SHOP_ADDRESS);
const NFTABI = require('../abis/NFT.json');
const nftInstance = new web3.eth.Contract(NFTABI, config.CONTRACTS.NFT_ADDRESS);
const MarketABI = require('../abis/Market.json');
const peNftMarket = new web3.eth.Contract(MarketABI, config.CONTRACTS.MARKET_ADDRESS);
const peService = require('../api/services/plant-empire.js');
const { TRANSACTION_TYPE } = require('../config/constants.js');
const { toHumanNumber } = require('../util/bignum.js');
const { onBuyPack } = require('../events/shop.js');

setInterval(async () => {
  if (RPCs.length <= 1) {
    return;
  }
  const rpcBlocks = await Promise.all(RPCs.map(rpc => (new Web3(getProvider(rpc))).eth.getBlockNumber()));
  const fastestRPC = orderBy(zipWith(RPCs, rpcBlocks, (a, b) => ({ rpc: a, latestBlock: b })), ['latestBlock'], ['desc']);
  const [firstRPC, secondRPC] = fastestRPC;
  if (firstRPC.latestBlock - secondRPC.latestBlock > 20) {
    SELECTED_RPC = firstRPC;
  }

}, 1200000)

const onOrbTransfer = async function (event) {
  console.log("TRANSFER", event);
  const { from, to, tokenId } = event.returnValues;
  const _tokenId = parseInt(tokenId);

  const MARKET_ADDRESS = config.CONTRACTS.MARKET_ADDRESS;
  if (to === MARKET_ADDRESS) {
    return itemService.updateItemStatus(_tokenId, 'Selling');
  } else if (from === MARKET_ADDRESS) {
    // return peService.orbChangeOwner(tokenId, to)
    await itemService.updateNftOwner(_tokenId, to);
    return itemService.updateItemStatus(_tokenId, 'Available');
  } else if (from === ZERO_ADDRESS) {
    return;
  }  else {
    return itemService.updateNftOwner(_tokenId, to);
  }
};

const addPlantFilledOrderTransaction = async (event) => {
  const { orderId, tokenId, buyer } = event.returnValues;
  const order = await peOrderService.findByOrderId(orderId);
  const price = toHumanNumber(order.price);
  return referralService.addTransaction(
    TRANSACTION_TYPE.BUY_PLANT,
    buyer,
    event.transactionHash,
    price,
    { orderId, buyer, tokenId }
  );
}

async function getEventsFromBlock (startBlock) {
  if (web3.currentProvider.host != SELECTED_RPC.rpc) {
    web3.setProvider(getProvider(SELECTED_RPC.rpc));
    // telegram.sendToHeroFiChannel(`Change RPC to: ${SELECTED_RPC.rpc} - Block Number: ${SELECTED_RPC.latestBlock}`).then();
  }
  let i = startBlock;
  try {
    const latestBlockNumber = (await web3.eth.getBlockNumber()) - 1;
    const STEP = 1500;

    if (i < latestBlockNumber) {
      let fromBlock, toBlock;
      if (i + STEP < latestBlockNumber) {
        fromBlock = i + 1;
        toBlock = i + STEP;
      } else {
        fromBlock = i + 1;
        toBlock = latestBlockNumber;
      }
      console.log('PlantEmpire FROM TO', fromBlock, toBlock);

      const nftTransferEvents = await nftInstance.getPastEvents('Transfer', { fromBlock: fromBlock, toBlock: toBlock });
      for (const transfer of nftTransferEvents) {
        await onOrbTransfer(transfer);
      }

      // Process PlantEmpire Nft Market events
      const peMarketEvents = await peNftMarket.getPastEvents(
        'allEvents',
        { fromBlock: fromBlock, toBlock: toBlock }
      );

      const peNftMarketPlaceOrderEvents = peMarketEvents.filter(e => e.event == 'PlaceOrder')
      await Promise.all(peNftMarketPlaceOrderEvents.map(e => peHeroMarketEventHandler.onPlaceOrder(e)));
      const peNftMarketUpdatePriceEvents = peMarketEvents.filter(e => e.event == 'UpdatePrice');
      await Promise.all(peNftMarketUpdatePriceEvents.map(e => peHeroMarketEventHandler.onUpdatePrice(e)));
      const peNftMarketFillOrderEvents = peMarketEvents.filter(e => e.event == 'FillOrder');
      await Promise.all(peNftMarketFillOrderEvents.map(e => peHeroMarketEventHandler.onFillOrder(e)));
      const peNftMarketCancelOrderEvents = peMarketEvents.filter(e => e.event == 'CancelOrder');
      await Promise.all(peNftMarketCancelOrderEvents.map(e => peHeroMarketEventHandler.onCancelOrder(e)));
      const shopEvents = await shopInstance.getPastEvents(
      'BuyPack',
        { fromBlock: fromBlock, toBlock: toBlock}
      )
      await Promise.all(shopEvents.map(e => onBuyPack(e)));


      await versionController.updateToBlock(VERSION_ID, toBlock);
      console.log('PlantEmpire END FROM TO', fromBlock, toBlock);
      if (EXIT_SIGNAL) {
        console.log('Signal exit');
        process.exit(0);
      }
      i = toBlock;
    }
    return setTimeout(() => getEventsFromBlock(i), 9000);
  } catch (err) {
    console.error('getEvents err: ', err);
    telegram.sendToSystemChannel(process.env.NODE_ENV + JSON.stringify(err)).then().catch();
    return setTimeout(() => getEventsFromBlock(i), 9000);
  }
}

async function subscribeEvents () {
  const version = await versionController.getVersion(VERSION_ID);
  if (!version) {
    const ORIGIN_BLOCK = config.ORIGIN_BLOCK;
    await versionController.createVersion(
      VERSION_ID,
      ORIGIN_BLOCK
    );
    return subscribeEvents();
  }
  const toBlock = version.toBlock;
  getEventsFromBlock(toBlock);
}

subscribeEvents();
