const mongoose = require('mongoose');

/**
 * User Schema
 * @private
 */
const ChestPieceSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    unique: true,
    index: true
  },
  owner: {
    type: String,
    index: true
  },
  chestType: {
    type: Number
  },
  status: { // Available/Selling
    type: String,
    default: 'Available',
  },

});

module.exports = mongoose.model('ChestPiece', ChestPieceSchema);
