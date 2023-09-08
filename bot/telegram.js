const TelegramBot = require('node-telegram-bot-api');

// Configuration
const TOKEN = '2023386345:AAGRdDwZPfbFApyfEax9CYVQE71HypiLK5U';
const bot = new TelegramBot(TOKEN);
const HEROFI_CHANNEL = -1001512174698;
const DAPP_GAMESERVER = -1001816566275;
const SYSTEM_CHANNEL = -1001885425597;

exports.constructBuyGemMessage = function (transactionHash, wallet, amount) {
  const txHash = `<b>TransactionHash: </b> <a href='https://bscscan.com/tx/${transactionHash}'>${transactionHash}</a>`;
  const walletInfo = `<b>Wallet: </b> <a href='https://bscscan.com/address/${wallet}'>${wallet}</a>`;
  const amountInfo = `<b>Gem Amount: </b> ${amount}`;
  return [txHash, walletInfo, amountInfo].join('\n');
}

exports.sendToHeroFiChannel = async function (message) {
  return bot.sendMessage(HEROFI_CHANNEL, message);
};

exports.sendToDappGameChannel = async function (message) {
  return bot.sendMessage(DAPP_GAMESERVER, message, { parse_mode: 'HTML' });
};

exports.sendToSystemChannel = async function (message) {
  return bot.sendMessage(SYSTEM_CHANNEL, message);
};
