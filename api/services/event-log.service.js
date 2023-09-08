const EventLog = require('../models/event-log.model.js');

exports.insertLog = async (fromBlock, toBlock, eventType, events) => {
  return EventLog.create(
    { fromBlock, toBlock, eventType, events }
  );
};
