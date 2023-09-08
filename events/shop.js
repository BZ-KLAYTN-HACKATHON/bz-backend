const packService = require('../api/pack/pack.service.js');
const itemService = require('../api/item/item.service.js');
const { ethers } = require("ethers");
const { getNft } = require('../api/services/plant-empire-hero.service.js');
function randomItem (type) {
  let attributes;
  switch (type) {
    case 'Vehicle':
      attributes = { mdp: 274, dp: 274, earnPoint: 3.0 };
      break;
    case 'Wing':
      attributes =  { mdp: 366, dp: 366, earnPoint: 3.0 };
      break;
    default:
      attributes = { mdp: 274, dp: 274, earnPoint: 2.0 };
  }
  return attributes;
}
const onBuyPack = async function (event) {
  const transactionHash = event.transactionHash;
  const { packId, buyer, tokenId, buyAt } = event.returnValues;
  const packIdDecoded = ethers.utils.parseBytes32String(packId)
  const pack = await packService.findByPackId(packIdDecoded);

  const imageUrl = pack.imageUrl;
  const videoUrl = pack.videoUrl;
  const itemDescription = pack.detail.itemDescription;
  const collectionDescription = pack.collectionDescription;
  const gameDescription = pack.gameDescription;
  const rarity = pack.detail.rarity;
  const type = pack.detail.type;
  let attributes = randomItem(type);
  const fullAttributes = {
    ...attributes,
    rarity,
    type: pack.detail.type
  };

  const newItem = {
    server: 1,
    name: pack.name,
    type: pack.itemType,
    attributes: fullAttributes,
    imageUrl,
    videoUrl,
    nftId: tokenId,
    collectionDescription,
    gameDescription,
    nftOwner: buyer,
    itemDescription
  }
  await itemService.createManyItems('RG-02', [newItem]);
  console.log(packId, tokenId);
};

exports.onBuyPack = onBuyPack;
