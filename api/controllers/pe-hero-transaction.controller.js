const PEHeroTransaction = require('../models/pe-hero-transaction.model.js');

exports.getTransactions = async (req, res) => {
  const { page } = req.query;
  const condition = {
    orderStatus: 'Filled',
  }
  const options = {
    page: page,
    limit: 10,
    sort: { blockNumber: -1 },
  };
  try {
    const orders = await PEHeroTransaction.paginate(condition, options);
    res.send(orders);
  } catch (e) {
    return res.status(400).send();
  }
};

exports.getTransactionsByNftId = async (req, res) => {
  const { nftAddress, tokenId } = req.params;
  const condition = {
    orderStatus: 'Filled',
    nftAddress: nftAddress,
    tokenId
  }
  const transactions = await PEHeroTransaction.find(condition).limit(10).sort({ blockNumber: -1})
  res.send({ data: transactions });
};

