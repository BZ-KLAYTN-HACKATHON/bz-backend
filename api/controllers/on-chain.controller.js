const onchainService = require('../services/on-chain.service.js');

// Subscribe HeroMarket's events on-chain

exports.getHero = async (req, res) => {
  const { tokenId } = req.params;
  try {
    const hero = await onchainService.getHero(tokenId);
    return res.json({...hero});
  } catch (err) {
    return res.send("Invalid tokenId or connect blockchain failed")
  }
};

exports.getLegendGuardianHero = async (req, res) => {
  const { tokenId } = req.params;
  try {
    const hero = await onchainService.getLegendGuardianHero(tokenId);
    return res.json({...hero});
  } catch (err) {
    return res.send("Invalid tokenId or connect blockchain failed")
  }
};
