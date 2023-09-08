const Spin = require('../models/spin.model.js');

exports.insertSpin = async (transactionHash, walletAddress, prize) =>  {
  return Spin.updateOne({ transactionHash }, { walletAddress, prize }, { upsert: true})
};

exports.getLatestSpin = async () => {
  return Spin.find({}).sort('-createdAt').limit(20).lean();
};
