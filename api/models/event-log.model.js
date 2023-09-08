const mongoose = require('mongoose');

/**
 * User Schema
 * @private
 */
const eventLogSchema = new mongoose.Schema({
  fromBlock: {
    type: Number,
  },
  toBlock: {
    type: Number,
  },
  eventType: {
    type: String,
  },
  events: [Object]
});

module.exports = mongoose.model('EventLog', eventLogSchema);
