const Web3 = require('web3');
const config = require('./config');
const TopUpABI = require('./abis/HeroFi/Topup.json');
const BigNumber = require('bignumber.js');
const _ = require('lodash')

const user = 'eth';
const password = 'JUbUOXC0oOQmBxYK'
// Subscribe HeroMarket's events on-chain
const provider = new Web3.providers.HttpProvider('https://rpc-node-01.bravechain.net', {
  headers: [
    {
      name: 'Authorization',
      value: 'Basic ZXRoOkpVYlVPWEMwb09RbUJ4WUs='
    }]});
const web3 = new Web3('https://bsctestapi.terminet.io/rpc');
// web3.eth.getTransaction('0xb8a34fdbb6be77fab569c03c5886c8de8fad2a77f48d248bdcd60ca7f996622b').then(console.log)

const PENftHeroAbi = require('./abis/PlantHeroNft.json');
const peNftInstance = new web3.eth.Contract(PENftHeroAbi, config.NFT_ADDRESS);

// Subscribe HeroMarket's events on-chain
const NFTAbi = require('./abis/PlantHeroNft.json');
const PEBoxABI = require('./abis/PlantEmpireHeroBox.json');
const hero = new web3.eth.Contract(NFTAbi, config.NFT_ADDRESS);
// hero.methods.getHero('1').call().then(console.log)
const PEHolyABI = require('./abis/PEHoly.json');
const peHoly = new web3.eth.Contract(PEHolyABI, config.HOLY_ADDRESS);
const LuckySpinABI = require('./abis/LuckySpin.json');
const luckySpin = new web3.eth.Contract(LuckySpinABI, '0x9b53fe8543dba5506a31b641d40390512002f2f9');
luckySpin.getPastEvents('SpinSuccess', { fromBlock: 24435224, toBlock: 24435224 }).then(console.log);

web3.eth.getBlockNumber().then(console.log)
const BEP20ABI = [
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'from',
        'type': 'address'
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'to',
        'type': 'address'
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'value',
        'type': 'uint256'
      }
    ],
    'name': 'Transfer',
    'type': 'event'
  }
];
const abiDecoder = require('abi-decoder'); // NodeJS
abiDecoder.addABI(BEP20ABI);
/*
web3.eth.getTransactionReceipt('0x83c6c7686f7ad9a84cad2f1fac962626d37285a5959c18ba02dd0b7b86986621').then(receipt => {
  const logs = receipt.logs.filter(log => log.address == '0xa83Bfcf9E252Adf1F39937984A4E113Eda6E445b');
  const decodedLogs = abiDecoder.decodeLogs(logs);
  const values = _.map(decodedLogs, 'events[2].value');
  const sum = BigNumber.sum.apply(null, values)
  console.log(sum.div(new BigNumber('10').pow(18)).toFixed(2));
})

*/

