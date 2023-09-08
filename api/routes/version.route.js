const express = require('express');
const controller = require('../controllers/version.controller.js');
const router = express.Router();

router
  .route('/latest-block')
  .get(controller.getLatestVersion)

module.exports = router;

