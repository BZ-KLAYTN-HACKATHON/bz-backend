const NFT = require('../models/nft.model');

exports.getGenesisNftsCount = async () => {
  return NFT.count({ 'generation': 'Genesis' });
};
exports.getNormalNftsCount = async () => {
  return NFT.count({ 'generation': 'Descendant'})
};

exports.updateNftAttributes = async (tokenId, agility, health, intelligence, precision, skills, name, sex) => {
  return NFT.updateOne({ tokenId }, { agility, health, intelligence, precision, skills, name, sex });
};
