const mongoose = require('mongoose');

/**
 * User Schema
 * @private
 */
const peNftSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    unique: true,
    index: true
  },
  owner: {
    type: String,
    index: true
  },
  // On-chain properties
  star: {
    type: Number
  },
  rarity: {
    type: Number
  },
  classType: {
    type: Number
  },
  plantId: {
    type: String
  },
  bornAt: {
    type: String
  },
  status: { // Available/Selling/Staking/Farming
    type: String,
    default: 'Available',
  },
  parents: [],

  level: {
    type: Number,
    default: 1
  },
  detail: Object,
  isOnOldMarket: {
    type: Boolean
  },
  lockToTime: {
    type: Date
  }
});

module.exports = mongoose.model('PENft', peNftSchema);
