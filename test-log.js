const Web3 = require('web3');
const config = require('./config/index.js');

function getProvider (rpc) {
  const OUR_OWN_NODE = 'https://rpc-node-01.bravechain.net';
  if (rpc == OUR_OWN_NODE) {
    return new Web3.providers.HttpProvider(rpc, {
      headers: [
        {
          name: 'Authorization',
          value: 'Basic ZXRoOkpVYlVPWEMwb09RbUJ4WUs='
        }]
    });
  } else {
    return new Web3.providers.HttpProvider(rpc);
  }
}
const web3 = new Web3(getProvider(config.premium_rpc));

const NftHeroAbi = require('../abis/factory.json');
