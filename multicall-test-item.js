const {
  Multicall,
} = require('ethereum-multicall');
const Web3 = require('web3');
const config = require('./config');

console.log('RPC', config.rpc);

// Subscribe HeroMarket's events on-chain
const provider = new Web3.providers.HttpProvider('https://rpc-node-01.bravechain.net', {
  headers: [
    {
      name: 'Authorization',
      value: 'Basic ZXRoOkpVYlVPWEMwb09RbUJ4WUs='
    }]});
const web3 = new Web3(provider);
web3.eth.getBlockNumber().then(console.log)

// Subscribe HeroMarket's events on-chain
const NFTAbi = require('./abis/factory.json');
const HeroFiItemABI = require('./abis/HeroFi/HeroFiItem.json');
const heroFiItem = new web3.eth.Contract(HeroFiItemABI, config.HERO_FI.HERO_FI_ITEM_ADDRESS);

const multicall = new Multicall({ web3Instance: web3, tryAggregate: true });

  const contractCallContext = [
    {
      reference: 1,
      contractAddress: config.HERO_FI.HERO_FI_ITEM_ADDRESS,
      abi: HeroFiItemABI,
      calls: [{ methodName: 'getItem', methodParameters: ['32'] }]
    },
    {
      reference: 2,
      contractAddress: config.HERO_FI.HERO_FI_ITEM_ADDRESS,
      abi: HeroFiItemABI,
      calls: [{ methodName: 'getItem', methodParameters: ['33'] }]
    }
  ];

/*
  multicall.call(contractCallContext).then(result => {
    // console.log(result.results[1].callsReturnContext[0])
    console.log(result.results[1].callsReturnContext[0].returnValues)
    const itemType = result.results[1].callsReturnContext[0].returnValues[1];
    console.log(web3.utils.hexToNumber(itemType.hex))
    console.log(result.results[2].callsReturnContext[0].returnValues)
    // console.log(result.results[2].callsReturnContext[0])
    // console.log(result.results[1].originalContractCallContext)
  });
*/

heroFiItem.methods.getItem('45').call().then(console.log)
// heroFiItem.methods.getItem('33').call().then(console.log)
