const nftController = require('../api/controllers/nft.controller.js');
const lgNftService = require('../api/services/legend-guardian/legend-guardian.service.js');

exports.onNewHero = async function (event) {
  const { heroTokenId, lgTokenId, ticketId } = event.returnValues;
  const transactionHash = event.transactionHash;

  const guardian = {
    lgTokenId: lgTokenId,
    usedTicketID: ticketId,
    txHash: transactionHash
  }

  const heroFi = {
    heroFiTokenId: heroTokenId,
    usedTicketID: ticketId,
    txHash: transactionHash
  }

  return Promise.all([
    nftController.upsertNft(heroTokenId, { legendGuardian: guardian}),
    lgNftService.upsertNft(lgTokenId, { heroFi: heroFi})
  ])
};
