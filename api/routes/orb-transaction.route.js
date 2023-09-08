const express = require('express');
const controller = require('../controllers/orb-transaction.controller.js');

const router = express.Router();

router
  .route('/')
  .get(controller.getTransactions)

module.exports = router;
