const Pack = require('./pack.model.js');

exports.findByPackId = async (packId) => {
  return Pack.findOne({ packId });
};

exports.find = async () => {
  return Pack.find();
};

exports.createNewPack = async (newPack) => {
  return Pack.create(newPack);
};

exports.updatePack = async (_id, newPack) => {
  return Pack.updateOne({_id}, {...newPack, $inc: { version: 1}});
};

exports.setPackDisabled = async (_id, isDisabled) => {
  return Pack.updateOne({_id}, {isDisabled});
};

exports.removePack = async (_id) => {
  return Pack.deleteOne({_id});
};

exports.updateAmountInStock = async (packId, variant) => {
  return Pack.updateOne({ packId }, { $inc: { amountInStock: variant } });
};

exports.findWithPagination = async (condition, sort, page) => {
  const options = {
    page: page,
    limit: 20,
    sort: sort,
    lean: true,
  };
  return Pack.paginate(condition, options);
};

exports.countPacksByNFTAddress = async (collectionId) => {
  return Pack.countDocuments({ collectionId: collectionId, packStatus: "Open" });
};

