const orderBy = require('lodash/orderBy');
const zipWith = require('lodash/zipWith');
const versionController = require('../api/controllers/version.controller.js');
const telegram = require('../bot/telegram.js');
const VERSION_ID = 3;
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
const planEmpireService = require('../api/services/plant-empire.js');
const ShopABI = require('../abis/PEShop.json');
const { getSumTokenTransfer } = require('../util/token.js');
const { toHumanNumber } = require('../util/bignum.js');
const referralService = require('../api/services/rofi-referral.js');
const { TRANSACTION_TYPE } = require('../config/constants.js');
const shopInstance = new web3.eth.Contract(ShopABI, config.CONTRACTS.SHOP_ADDRESS);

setInterval(async () => {
  const rpcBlocks = await Promise.all(RPCs.map(rpc => (new Web3(getProvider(rpc))).eth.getBlockNumber()));
  const fastestRPC = orderBy(zipWith(RPCs, rpcBlocks, (a, b) => ({ rpc: a, latestBlock: b })), ['latestBlock'], ['desc']);
  const [firstRPC, secondRPC] = fastestRPC;
  if (firstRPC.latestBlock - secondRPC.latestBlock > 20) {
    SELECTED_RPC = firstRPC;
  }

}, 1200000)

const onBuyPack = async function (event) {
  const { transactionHash, blockNumber } = event;
  const { packId, buyer, buyAt, gemAmount } = event.returnValues;
  // Add to referral server
  const {from, logs} = await web3.eth.getTransactionReceipt(transactionHash);
  const transferTokenLogs = logs.filter(log => log.address == config.CONTRACTS.PEFI_TOKEN_ADDRESS);
  const totalToken = getSumTokenTransfer(transferTokenLogs);
  const price = toHumanNumber(totalToken);
  await referralService.addTransaction(
    TRANSACTION_TYPE.BUY_GEM,
    from,
    transactionHash,
    price,
    { packId, buyer, buyAt, gemAmount }
  );
  // End add to referral server
  const buyGemMessage = telegram.constructBuyGemMessage(transactionHash, buyer, gemAmount);
  telegram.sendToDappGameChannel(buyGemMessage).then();

  const packIdNumber = parseInt(packId);
  // Pack from 1 to 6 is buying Gem, the rest is buy chest
  if (packIdNumber <= 6) {
    return planEmpireService.buyPack(
      transactionHash,
      buyer,
      packIdNumber,
      parseInt(gemAmount),
      blockNumber,
      parseInt(buyAt)
    );
  } else if (packIdNumber <= 15) {
    return planEmpireService.buyOtherPack(transactionHash, buyer, packIdNumber, Number(price));
  } else if (packIdNumber <= 24) {
    return planEmpireService.buyPVPPack(transactionHash, buyer, packIdNumber, Number(price));
  } else {
    return planEmpireService.buyFarmShopPack(transactionHash, buyer, packIdNumber, parseInt(gemAmount));
  }
};

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
      console.log('PlantEmpireDeposit FROM TO', fromBlock, toBlock);
      const peShopBuyPackEvents = await shopInstance.getPastEvents('BuyPack', {fromBlock, toBlock})
      await Promise.all(peShopBuyPackEvents.map(event => onBuyPack(event)));

      await versionController.updateToBlock(VERSION_ID, toBlock);
      console.log('PlantEmpireDeposit END FROM TO', fromBlock, toBlock);
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
