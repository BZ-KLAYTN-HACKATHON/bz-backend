const Box = require('../models/box.model');

exports.upsertBoxTypeByTokenId = async (tokenId, boxType) => {
  return Box.updateOne({ tokenId }, { boxType }, { upsert: true});
};

exports.upsertOwnerByTokenId = async (tokenId, owner) => {
  return Box.updateOne({ tokenId }, { owner }, { upsert: true });
};

exports.getBoxByOwner = async (owner) => {
  return Box.find({ owner }).lean();
};
