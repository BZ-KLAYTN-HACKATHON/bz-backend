const ChestPiece = require('../models/chest-pieces.model.js');

exports.upsertChestPieceByTokenId = async (tokenId, chestType) => {
  return ChestPiece.updateOne({ tokenId }, { chestType: chestType }, { upsert: true });
};

exports.upsertOwnerByTokenId = async (tokenId, owner) => {
  return ChestPiece.updateOne({ tokenId }, { owner }, { upsert: true });
};

exports.upsertPiece = async (tokenId, nft) =>  {
  return ChestPiece.findOneAndUpdate({ tokenId: tokenId }, nft, { upsert: true });
};

exports.getChestPieceByOwner = async (owner) => {
  return ChestPiece.find({ owner }).lean();
};
