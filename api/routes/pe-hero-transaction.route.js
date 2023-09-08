const express = require('express');
const controller = require('../controllers/pe-hero-transaction.controller.js');

const router = express.Router();

router
  .route('/')
  .get(controller.getTransactions)

router
  .route('/tokens/:nftAddress/:tokenId')
  .get(controller.getTransactionsByNftId)

module.exports = router;
