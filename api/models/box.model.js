const mongoose = require('mongoose');

/**
 * User Schema
 * @private
 */
const BoxSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    unique: true,
    index: true
  },
  owner: {
    type: String,
    index: true
  },
  boxType: {
    type: Number
  },
  status: { // Available/Selling
    type: String,
    default: 'Available',
  },

});

module.exports = mongoose.model('Box', BoxSchema);
