const orderBy = require('lodash/orderBy');
const zipWith = require('lodash/zipWith');
const versionController = require('../api/controllers/version.controller.js');
const pefiClaimService = require('../api/services/pefi-claim.js');
const peHeroEventHandler = require('../events/pe/pe-nft.js');
const holyOrderService = require('../api/services/holy-order.service.js');
const referralService = require('../api/services/rofi-referral.js');
const peBoxEventHandler = require('../events/plant-empire-box.js');
const boxService = require('../api/services/box.service.js');
const peHolyEventHandler = require('../events/pe-holy.js');
const telegram = require('../bot/telegram.js');
const VERSION_ID = 1;
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

const PEBoxABI = require('../abis/PlantEmpireHeroBox.json');
const peBox = new web3.eth.Contract(PEBoxABI, config.PLANT_EMPIRE_BOX_ADDRESS);
const PEHolyABI = require('../abis/PEHoly.json');
const peHoly = new web3.eth.Contract(PEHolyABI, config.HOLY_ADDRESS);
const ConvertGHFI = require('../abis/ConvertGHFI.json');
const convertGPEFIInstance = new web3.eth.Contract(ConvertGHFI, config.CONTRACTS.CONVERT_GPEFI);
const convertGPEFIInstance2 = new web3.eth.Contract(ConvertGHFI, config.CONTRACTS.NEW_CONVERT_GPEFI);
const PENftHeroAbi = require('../abis/PlantHeroNft.json');
const planEmpireService = require('../api/services/plant-empire.js');
const unset = require('lodash/unset');
const plantEmpireNftService = require('../api/services/plant-empire-hero.service.js');
const peNftInstance = new web3.eth.Contract(PENftHeroAbi, config.NFT_ADDRESS);
const ShopABI = require('../abis/PEShop.json');
const holyMarketEventHandler = require('../events/holy-market.js');
const HolyMarketABI = require('../abis/PEHeroMarket.json');
const { TRANSACTION_TYPE } = require('../config/constants.js');
const { toHumanNumber } = require('../util/bignum.js');
const { getSumTokenTransfer } = require('../util/token.js');
const amqp = require('amqp-connection-manager');
const holyMarketInstance = new web3.eth.Contract(HolyMarketABI, config.CONTRACTS.HOLY_MARKET_ADDRESS);

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

const onInitPENFT = async function (event) {
  const { tokenId, heroType } = event.returnValues;
  const {
    isGenesis,
    bornAt,
    star
  } = await peNftInstance.methods.getHero(tokenId).call();

  const attributes = await planEmpireService.spawnHero(
    tokenId,
    heroType,
    star,
    isGenesis
  );
  unset(attributes, '$id')
  const guardian = {
    detail: attributes,
    generation: isGenesis ? 'Genesis' : 'Descendant',
    star,
    bornAt,
    heroType: heroType
  };

  return planEmpireService.upsertPEHero(
    tokenId,
    {
      ...guardian,
      nftAddress: config.NFT_ADDRESS
    }
  );
};

const onBoxMint = async function (event) {
  const { user, tokenId, boxType } = event.returnValues;
  // Add to referral server
  const transactionHash = event.transactionHash;
  const {from, logs} = await web3.eth.getTransactionReceipt(transactionHash);
  const transferTokenLogs = logs.filter(log => log.address == config.CONTRACTS.PEFI_TOKEN_ADDRESS);
  const totalToken = getSumTokenTransfer(transferTokenLogs);
  const price = toHumanNumber(totalToken);
  await referralService.addTransaction(
    TRANSACTION_TYPE.BUY_BOX,
    from,
    transactionHash,
    price,
    {}
  );
  // End add to referral server
  return Promise.all([
    boxService.upsertBoxTypeByTokenId(tokenId, boxType),
    // planEmpireService.giftCard(user, boxType, 1)
  ]);
}

/*
const onBoxOpen = async function (event) {
  const { user, boxId, heroId } = event.returnValues;
  const transactionHash = event.transactionHash;

  const heroIds = [heroId];
  const contractCallContext = heroIds.map(id => ({
    reference: id,
    contractAddress: config.NFT_ADDRESS,
    abi: PENftHeroAbi,
    calls: [{ methodName: 'getHero', methodParameters: [id] }]
  }))

  // Get many items from on-chain
  const { results } = await multicall.call(contractCallContext);
  const items = [];
  heroIds.forEach(id => {
    const [star, rarity, classType, plantId, bornAt] = results[id].callsReturnContext[0].returnValues;
    items.push({star, rarity, classType: classType, plantId: web3.utils.hexToNumber(plantId.hex), tokenId: id, boxId, bornAt: web3.utils.hexToNumber(bornAt.hex), transactionHash: transactionHash})
  });

  const itemGenerationResults = await Promise.all(items.map(item => planEmpireService.spawnHero(item.tokenId, item.star, item.rarity, item.classType, item.plantId, user)))
  const itemUpdates = zipWith(items, itemGenerationResults, (item, result) => ({...item, detail: result}))
  return plantEmpireNftService.bulkUpsertPENft(itemUpdates);
};
*/

const addHolyFilledOrderTransaction = async (event) => {
  const { orderId, tokenId, buyer } = event.returnValues;
  const order = await holyOrderService.findByOrderId(orderId);
  const price = toHumanNumber(order.price);
  return referralService.addTransaction(
    TRANSACTION_TYPE.BUY_HOLY,
    buyer,
    event.transactionHash,
    price,
    { orderId, buyer, tokenId }
  );
};
const onConvertSuccessGPEFI = async function (event) {
  const { user, requestId } = event.returnValues;
  return pefiClaimService.claimToken(user, requestId, event.transactionHash);
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
      console.log('PE- Independent: FROM TO', fromBlock, toBlock);

/*
      const peBoxEvents = await peBox.getPastEvents(
        'allEvents',
        {fromBlock: fromBlock, toBlock: toBlock}
      )
      const peBoxTransferEvent = peBoxEvents.filter(e => e.event == 'Transfer');
      await Promise.all(peBoxTransferEvent.map(e => peBoxEventHandler.onTransfer(e)));
      const peBoxMintEvents = peBoxEvents.filter(e => e.event == 'BoxMint');
      await Promise.all(peBoxMintEvents.map(e => onBoxMint(e)));
*/

      const peHolyEvents = await peHoly.getPastEvents(
        'allEvents',
        {fromBlock: fromBlock, toBlock: toBlock}
      )
      const peHolyTransferEvent = peHolyEvents.filter(e => e.event == 'Transfer');
      await Promise.all(peHolyTransferEvent.map(e => peHolyEventHandler.onTransfer(e)));
      const peNewPackageEvents = peHolyEvents.filter(e => e.event == 'NewPackage');
      await Promise.all(peNewPackageEvents.map(e => peHolyEventHandler.onNewPackage(e)));

      // Process PlantEmpire Orb Market events
      const holyMarketEvents = await holyMarketInstance.getPastEvents(
        'allEvents',
        { fromBlock: fromBlock, toBlock: toBlock }
      );

      const holyMarketPlaceOrderEvents = holyMarketEvents.filter(e => e.event == 'PlaceOrder')
      await Promise.all(holyMarketPlaceOrderEvents.map(e => holyMarketEventHandler.onPlaceOrder(e)));
      const holyMarketUpdatePriceEvents = holyMarketEvents.filter(e => e.event == 'UpdatePrice');
      await Promise.all(holyMarketUpdatePriceEvents.map(e => holyMarketEventHandler.onUpdatePrice(e)));
      const holyMarketFillOrderEvents = holyMarketEvents.filter(e => e.event == 'FillOrder');
      await Promise.all(holyMarketFillOrderEvents.map(e => holyMarketEventHandler.onFillOrder(e)));
      await Promise.all(holyMarketFillOrderEvents.map(e => addHolyFilledOrderTransaction(e)));
      const holyMarketCancelOrderEvents = holyMarketEvents.filter(e => e.event == 'CancelOrder');
      await Promise.all(holyMarketCancelOrderEvents.map(e => holyMarketEventHandler.onCancelOrder(e)));

/*
      const convertGPEFIEvents = await convertGPEFIInstance.getPastEvents(
        'ConvertSuccess',
        { fromBlock: fromBlock, toBlock: toBlock }
      );
      await Promise.all(convertGPEFIEvents.map(e => onConvertSuccessGPEFI(e)));
*/

      const convertGPEFIEvents2 = await convertGPEFIInstance2.getPastEvents(
        'ConvertSuccess',
        { fromBlock: fromBlock, toBlock: toBlock }
      );
      await Promise.all(convertGPEFIEvents2.map(e => onConvertSuccessGPEFI(e)));

      await versionController.updateToBlock(VERSION_ID, toBlock);
      console.log('PE- Independent: END FROM TO', fromBlock, toBlock);
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
