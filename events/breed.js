const breedController = require('../api/controllers/breed.controller.js');

const config = require('../config');
const Web3 = require('web3');

// Subscribe HeroMarket's events on-chain
const web3 = new Web3(config.rpc);
const BreedAbi = require('../abis/Breeding.json');
const breed = new web3.eth.Contract(BreedAbi, config.HERO_FI.HERO_FI_BREED_ADDRESS);

const onPregnant = async function (event) {
  const blockNumber = event.blockNumber;
  const { owner, tokenId1, tokenId2, breedingPeriod, breedId } = event.returnValues;
  const { startAt } = await breed.methods.getBreed(breedId).call();
  return breedController.startBreed(
    breedId,
    owner,
    tokenId1,
    tokenId2,
    startAt,
    breedingPeriod,
    blockNumber
  );
};

const onGiveBirth = async function (event) {
  const { owner, tokenId1, tokenId2, tokenId: newTokenId, breedId } = event.returnValues;
  return breedController.giveBirth(breedId, owner, tokenId1, tokenId2, newTokenId);
};

exports.onPregnant = onPregnant;
exports.onGiveBirth = onGiveBirth;
