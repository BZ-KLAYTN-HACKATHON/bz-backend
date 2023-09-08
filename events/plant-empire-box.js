const config = require('../config');
const PEHeroABI = require('../abis/PlantHeroNft.json');
const some = require('lodash/some')
const { Multicall } = require('ethereum-multicall');
const Web3 = require('web3');
const zipWith = require('lodash/zipWith');
const cloneDeep = require('lodash/cloneDeep');
const planEmpireService = require('../api/services/plant-empire.js');
const plantEmpireNftService = require('../api/services/plant-empire-hero.service.js');
const boxService = require('../api/services/box.service.js');
const { getProvider } = require('../util/rpc.js');
const web3 = new Web3(getProvider(config.premium_rpc));
const multicall = new Multicall({ web3Instance: web3, tryAggregate: true });

exports.onBoxOpen = async function (event) {
  const { user, boxId, heroId } = event.returnValues;
  const heroIds = [heroId]
  const transactionHash = event.transactionHash;
  const contractCallContext = heroIds.map(id => ({
    reference: id,
    contractAddress: config.NFT_ADDRESS,
    abi: PEHeroABI,
    calls: [{ methodName: 'getHero', methodParameters: [id] }]
  }))

  // Get many items from on-chain
  const { results } = await multicall.call(contractCallContext);
  const items = [];
  heroIds.forEach(id => {
    const [star, rarity, classType, plantId, bornAt] = results[id].callsReturnContext[0].returnValues;
    items.push({star, rarity, classType: classType, plantId: web3.utils.hexToNumber(plantId.hex), tokenId: id, boxId, bornAt: web3.utils.hexToNumber(bornAt.hex), transactionHash: transactionHash})
  });
  if (some(items, ({ star, itemType }) => star == 0 || itemType == 0)) {
    throw new Error('There are some items that have star or itemType equal 0');
  }

  const itemGenerationResults = await Promise.all(items.map(item => planEmpireService.spawnHero(item.tokenId, item.star, item.rarity, item.classType, item.plantId, user)))
  const itemUpdates = zipWith(items, itemGenerationResults, (item, result) => ({...item, detail: result}))

  await plantEmpireNftService.bulkUpsertPENft(cloneDeep(itemUpdates));
  // await Promise.all(items.map(item => rabbit.sendToQueue(config.RABBIT_MQ.HERO_FI_ITEM_CREATION, item)));
  return itemUpdates;
}

exports.onTransfer = async function (event) {
  const { to, tokenId } = event.returnValues;
  return boxService.upsertOwnerByTokenId(tokenId, to);
};
