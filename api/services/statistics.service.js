const Statistic = require('../models/statistics.model.js');

exports.updateStatisticByType = async (type, update) => {
  return Statistic.updateOne({ type: type }, update, { upsert: true });
};

