const mongoose = require('mongoose');

/**
 * User Schema
 * @private
 */
const SpinSchema = new mongoose.Schema({
  transactionHash: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  prize: {
    type: String,
    required: true
  },
  walletAddress: {
    type: String,
    required: true
  }
}, {
  timestamps:
    {
      createdAt: true,
      updatedAt: false
    }
});

module.exports = mongoose.model('Spin', SpinSchema);
