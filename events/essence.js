const config = require('../config');
const Web3 = require('web3');

// Subscribe HeroMarket's events on-chain
const web3 = new Web3(config.rpc);
const EssenceABI = require('../abis/Essence.json');
const essenceController = require('../api/controllers/essence.controller.js');
const lgNftService = require('../api/services/legend-guardian/legend-guardian.service.js');
const essence = new web3.eth.Contract(EssenceABI, config.ESSENCE_ADDRESS);

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

exports.onTransfer = async function (event) {
  const { from, to, tokenId } = event.returnValues;
  const OLD_MARKET = config.ESSENCE_MARKET_ADDRESS;
  if (from === OLD_MARKET) {
    return essenceController.upsertEssence(tokenId, { status: 'Available', owner: to, isOnOldMarket: false });
  }
  if (to === OLD_MARKET) {
    return essenceController.upsertEssence(tokenId, { status: 'Selling', isOnOldMarket: true });
  }
  if (to === config.LEGEND_GUARDIAN_CONTRACTS.LEGEND_GUARDIAN_ESSENCE_MARKET_ADDRESS) {
    return essenceController.upsertEssence(tokenId, { status: 'Selling' });
  } else if (from === config.LEGEND_GUARDIAN_CONTRACTS.LEGEND_GUARDIAN_ESSENCE_MARKET_ADDRESS) {
    return essenceController.upsertEssence(tokenId, { status: 'Available', owner: to });
  } else {
    if (from === ZERO_ADDRESS) {
      const { star } = await essence.methods.getTicket(tokenId).call();
      let newNFT = {
        nftAddress: essence._address,
        owner: to,
        status: 'Available',
        star: star
      };
      return essenceController.upsertEssence(tokenId, newNFT);
    } else {
      let newNFT = {
        owner: to,
        status: 'Available'
      };
      return essenceController.upsertEssence(tokenId, newNFT);
    }
  }
};

