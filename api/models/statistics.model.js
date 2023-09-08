const mongoose = require('mongoose');

/**
 * User Schema
 * @private
 */
const statisticSchema = new mongoose.Schema({
  type: {
    type: String,
    unique: true,
    index: true
  },
  fromBlock: Number,
  toBlock: Number,
  totalSale: String,
  totalVolume: String,
  heroesSold: String,
  info: Object
}, {timestamps: true});

module.exports = mongoose.model('Statistic', statisticSchema);
