const holyService = require('../api/services/holy.service.js');
const pefiClaimService = require('../api/services/pefi-claim.js');
const config = require('../config/index.js');

exports.onTransfer = async function (event) {
  const { from, to, tokenId } = event.returnValues;

  const MARKET_ADDRESS = config.CONTRACTS.HOLY_MARKET_ADDRESS;
  const OLD_MARKET_ADDRESS = config.CONTRACTS.HOLY_OLD_MARKET_ADDRESS;
  if (to === MARKET_ADDRESS) {
    return holyService.upsertHolyByTokenId(tokenId, { status: 'Selling'});
  } else if (from === MARKET_ADDRESS) {
    return holyService.upsertHolyByTokenId(tokenId, {owner: to, status: 'Available'});
  } else if (from === OLD_MARKET_ADDRESS) {
    return holyService.upsertHolyByTokenId(tokenId, {owner: to, status: 'Available', isOnOldMarket: false});
  } else if (to === OLD_MARKET_ADDRESS) {
    return holyService.upsertHolyByTokenId(tokenId, { status: 'Selling', isOnOldMarket: true });
  }  else {
    return holyService.upsertHolyByTokenId(tokenId, {owner: to, status: 'Available'});
  }
};

exports.onNewPackage = async function (event) {
  const { packageId, holyType, user, createdAt } = event.returnValues;
  return Promise.all([
    holyService.upsertHolyTypeByTokenId(packageId, holyType)
    // pefiClaimService.mintHoly(user, packageId, holyType, createdAt)
  ]);
}
