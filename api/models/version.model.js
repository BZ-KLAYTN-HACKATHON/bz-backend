const mongoose = require('mongoose');

/**
 * User Schema
 * @private
 */
const versionSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  fromBlock: {
    type: Number
  },
  toBlock: {
    type: Number,
    required: true
  },
});

module.exports = mongoose.model('Version', versionSchema);
