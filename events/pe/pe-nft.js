const config = require('../../config');
const lgNftService = require('../../api/services/plant-empire-hero.service.js');
const peService = require('../../api/services/plant-empire.js')
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

exports.onTransfer = async function (event) {
  const { from, to, tokenId } = event.returnValues;

  const PLANT_EMPIRE_MARKET_ADDRESS = config.CONTRACTS.PLANT_EMPIRE_HERO_MARKET_ADDRESS;
  if (to === PLANT_EMPIRE_MARKET_ADDRESS) {
    return lgNftService.upsertPEHero(tokenId, { status: 'Selling' });
  } else if (from === PLANT_EMPIRE_MARKET_ADDRESS) {
    return Promise.all([
      lgNftService.upsertPEHero(tokenId, { status: 'Available', owner: to }),
      peService.changeOwner(tokenId, to)
    ]);
  } else if (to === config.CONTRACTS.PLANT_EMPIRE_HERO_FARM) {
    return lgNftService.upsertPEHero(tokenId, { status: 'Farming' });
  } else {
    await peService.transferHero(tokenId, to);
    let lockToTimeValue = null;
    if (from != ZERO_ADDRESS) {
      const { data: { lockToTime } } = await peService.getHeroInfoById(tokenId);
      lockToTimeValue = lockToTime;
    }
    const newNFT = {
      nftAddress: config.NFT_ADDRESS,
      tokenId: tokenId,
      owner: to,
      status: 'Available',
      lockToTime: lockToTimeValue
    };
    return lgNftService.upsertPEHero(tokenId, newNFT)
  }
};
