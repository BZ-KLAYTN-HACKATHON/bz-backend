const express = require('express');
const itemRoutes = require('../item/item.route.js');
const packRoutes = require('../pack/pack.route.js');
const peHeroOrderRoutes = require('./pe-hero-order.route.js');
const orbOrderRoutes = require('./orb-order.route.js');
const holyOrderRoutes = require('./holy-order.route.js');
const pieceOrderRoutes = require('./order.route.js');
const peHeroTransactionRoutes = require('./pe-hero-transaction.route.js');
const orbTransactionRoutes = require('./orb-transaction.route.js');
const holyTransactionRoutes = require('./holy-transaction.route.js');
const pieceTransactionRoutes = require('./piece-transaction.route.js');
const statisticRoutes = require('./statistics.route.js');
const onchainRoutes = require('./on-chain.route.js');
// const correctRoutes = require('./correct.route.js');
const versionRoutes = require('./version.route.js');

const router = express.Router();

router.get('/status', (req, res) => res.send('OK'));

router.use('/', itemRoutes);
router.use('/', packRoutes);
router.use('/', pieceOrderRoutes);
router.use('/plant-empire/transactions/heroes', peHeroTransactionRoutes);
router.use('/plant-empire/transactions/orbs', orbTransactionRoutes);
router.use('/plant-empire/transactions/holies', holyTransactionRoutes);
router.use('/plant-empire/transactions/pieces', pieceTransactionRoutes);
router.use('/plant-empire/statistics', statisticRoutes);
router.use('/on-chain', onchainRoutes)
// router.use('/correct', correctRoutes);
router.use('/version', versionRoutes);

module.exports = router;
