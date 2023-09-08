const Holy = require('../models/holy.model.js');

exports.upsertHolyTypeByTokenId = async (tokenId, holyType) => {
  return Holy.updateOne({ tokenId }, { holyType }, { upsert: true});
};

exports.upsertHolyByTokenId = async (tokenId, newValues) => {
  return Holy.updateOne({ tokenId }, newValues, { upsert: true });
};

exports.getHolyByOwner = async (owner) => {
  return Holy.find({ owner }).lean();
};
