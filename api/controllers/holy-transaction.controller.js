const holyTransactionService = require('../services/holy-transaction.service.js');

exports.getTransactions = async (req, res) => {
  const { page } = req.query;
  const condition = {
    orderStatus: 'Filled',
  }

  try {
    const orders = await holyTransactionService.getTransaction(condition, page);
    res.send(orders);
  } catch (e) {
    return res.status(400).send();
  }
};
