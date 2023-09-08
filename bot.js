const mongoose = require('./mongoose');
mongoose.connect();

const Web3 = require('web3');
const versionController = require('./api/controllers/version.controller.js');
const versionDynamo = require('./dynamo/version.dynamo.js');
const rpc = 'https://bsc-dataseed1.defibit.io/';
console.log('RPC', rpc);
// Subscribe HeroMarket's events on-chain
const web3 = new Web3(rpc);
const telegram = require('./bot/telegram.js');
const BLOCK_DIFF_THRESHOLD = 200;

checkCurrentBlockDelay('1');
checkCurrentBlockDelay('2');
var checkDynamoBlockDelayCron = setInterval(checkDynamoCurrentBlockDelay, 60000);

function checkCurrentBlockDelay(VERSION_ID) {
  const checkCurrentBlockDelayCron = setTimeout(async function  () {
    const currentBlock = await web3.eth.getBlockNumber();
    const version = await versionController.getVersion(VERSION_ID);
    const blockDiff = currentBlock - parseInt(version.toBlock);

    if (blockDiff > BLOCK_DIFF_THRESHOLD) {
      await telegram.sendToHeroFiChannel(`[${process.env.NODE_ENV}][Dapp-VersionID ${VERSION_ID}] Warning:
      Delay block ${blockDiff}
      Current Block: ${version.toBlock}
      BSC latest block: ${currentBlock}
      `);
      clearInterval(checkCurrentBlockDelayCron);
    }
  }, 60000)
};

async function checkDynamoCurrentBlockDelay() {
  const VERSION_ID = '2';
  const currentBlock = await web3.eth.getBlockNumber();
  const version = (await versionDynamo.getVersion(VERSION_ID)).Item;
  const blockDiff = currentBlock - parseInt(version.toBlock.N);

  if (blockDiff > BLOCK_DIFF_THRESHOLD) {
    await telegram.sendToHeroFiChannel(`[${process.env.NODE_ENV}] Warning: Dynamo delay block ${blockDiff}`);
    clearInterval(checkDynamoBlockDelayCron)
  }
};

