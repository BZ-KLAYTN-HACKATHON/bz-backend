const PlantEmpireHero = require('../models/plant-empire-nft.model.js');
const telegram = require('../../bot/telegram.js');
const config = require('../../config');

async function upsertPEHero (tokenId, nft) {
  if (nft.owner == config.CONTRACTS.PLANT_EMPIRE_HERO_MARKET_ADDRESS) {
    telegram.sendToDappGameChannel('Forbid market address' + JSON.stringify(nft)).then();
    telegram.sendToDappGameChannel('Forbid market address stack' + new Error().stack).then();
    throw new Error('Forbid Market Address');
  }
  return PlantEmpireHero.findOneAndUpdate({ tokenId: tokenId }, nft, { upsert: true });
};

exports.updateHeroFiItemOwner = async (tokenId, owner) => {
  if (owner == config.CONTRACTS.PLANT_EMPIRE_HERO_MARKET_ADDRESS) {
    telegram.sendToHeroFiChannel('Forbid market address' + tokenId).then();
    throw new Error('Forbid Market Address2');
  }
  return PlantEmpireHero.updateOne({ tokenId: tokenId }, { owner: owner });
};

exports.updatePEHero = async (tokenId, detail) => {
  return PlantEmpireHero.updateOne({ tokenId: tokenId }, { detail});
};

exports.updateHeroFiItemStatus = async (tokenId, status) => {
  return PlantEmpireHero.updateOne({ tokenId: tokenId }, { status: status });
};

exports.upsertPEHero = upsertPEHero;

exports.getNft = async (tokenId) => {
  return PlantEmpireHero.findOne({ tokenId: tokenId });
};

exports.getHeroFiItemsByOwner = async (owner) => {
  return PlantEmpireHero.find({ owner: owner });
};

exports.getHeroFiItemTokenIdsByOwner = async (owner) => {
  return PlantEmpireHero.find({ owner: owner }).select('tokenId').lean();
};

exports.bulkUpsertPENft = async(items) => {
  const bulkOperations = items.map(item => ({
    'updateOne': {
      'filter': { tokenId: item.tokenId },
      'update': item,
      'upsert': true
    }
  }));
  return PlantEmpireHero.bulkWrite(bulkOperations);
}
