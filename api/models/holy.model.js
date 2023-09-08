const mongoose = require('mongoose');

/**
 * User Schema
 * @private
 */
const HolySchema = new mongoose.Schema({
  tokenId: {
    type: String,
    unique: true,
    index: true
  },
  owner: {
    type: String,
    index: true
  },
  holyType: {
    type: String
  },
  status: { // Available/Selling
    type: String,
    default: 'Available',
  },
  isOnOldMarket: {
    type: Boolean
  },
});

module.exports = mongoose.model('Holy', HolySchema);
