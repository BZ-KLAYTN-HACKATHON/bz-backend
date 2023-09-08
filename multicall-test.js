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
const hero = new web3.eth.Contract(NFTAbi, config.NFT_ADDRESS);

const multicall = new Multicall({ web3Instance: web3, tryAggregate: true });

  const contractCallContext = [
    {
      reference: 1,
      contractAddress: config.NFT_ADDRESS,
      abi: NFTAbi,
      calls: [{ methodName: 'getHero', methodParameters: [1] }]
    },
    {
      reference: 2,
      contractAddress: config.NFT_ADDRESS,
      abi: NFTAbi,
      calls: [{ methodName: 'getHero', methodParameters: [20000] }]
    }
  ];

  multicall.call(contractCallContext).then(result => {
    console.log(result.results[1].callsReturnContext[0])
    // console.log(result.results[1].callsReturnContext[0].returnValues)
    // console.log(result.results[2].callsReturnContext[0].returnValues)
    // console.log(result.results[1].originalContractCallContext)
  });

// hero.methods.getHero('1').call().then(console.log)
// hero.methods.getHero('2').call().then(console.log)
// hero.methods.ownerOf('21').call().then(console.log)
// hero.methods.isBanned('13997').call().then(console.log)
