const NftHeroAbi = require('../../abis/factory.json');
const Web3 = require('web3');

const config = require('../../config');
const LegendGuardianAbi = require('../../abis/LegendGuardian/LGGateway.json');
const { getProvider } = require('../../libs/getProvider.js');

// Subscribe HeroMarket's events on-chain
const web3 = new Web3(getProvider(config.rpc));
const nftInstance = new web3.eth.Contract(NftHeroAbi, config.NFT_ADDRESS);
const legendGuardianInstance = new web3.eth.Contract(LegendGuardianAbi, config.LEGEND_GUARDIAN_GATEWAY_ADDRESS)

exports.getHero = async (tokenId) => {
  return nftInstance.methods.getHero(tokenId).call();
};

exports.getLegendGuardianHero = async (tokenId) => {
  return legendGuardianInstance.methods.getLog(tokenId).call();
};
