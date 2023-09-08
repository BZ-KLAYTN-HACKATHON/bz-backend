const Statistic = require('../models/statistics.model.js');

const HERO_TYPES = ['ONE_DAYS', 'SEVEN_DAYS', 'TEN_DAYS', 'THIRTY_DAYS'];
const ORB_TYPES = ['ORB_ONE_DAYS', 'ORB_SEVEN_DAYS', 'ORB_TEN_DAYS', 'ORB_THIRTY_DAYS'];
const HOLY_TYPES = ['HOLY_ONE_DAYS', 'HOLY_SEVEN_DAYS', 'HOLY_TEN_DAYS', 'HOLY_THIRTY_DAYS'];
const PIECE_TYPES = ['PIECE_ONE_DAYS', 'PIECE_SEVEN_DAYS', 'PIECE_TEN_DAYS', 'PIECE_THIRTY_DAYS'];

exports.getStatistics = async (req, res) => {
  const statistic = await Statistic.find({ type: { $in: HERO_TYPES } });
  res.send({ data: statistic });
};

exports.getOrbStatistics = async (req, res) => {
  const statistic = await Statistic.find({ type: { $in: ORB_TYPES } });
  res.send({ data: statistic });
};

exports.getHolyStatistics = async (req, res) => {
  const statistic = await Statistic.find({ type: { $in: HOLY_TYPES } });
  res.send({ data: statistic });
};


exports.getPieceStatistics = async (req, res) => {
  const statistic = await Statistic.find({ type: { $in: PIECE_TYPES } });
  res.send({ data: statistic });
};
