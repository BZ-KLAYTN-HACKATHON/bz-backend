const Item = require('./item.model.js');
const { ITEM_STATUS } = require('../../config/constants.js');

exports.createManyItems = async (collectionId, items) => {
  const newItems = items.map(item => ({
    collectionId,
    attributes: item.attributes,
    type: item.type,
    imageUrl: item.imageUrl,
    videoUrl: item.videoUrl,
    name: item.name,
    server: item.server,
    nftOwner: item.nftOwner,
    nftId: item.nftId,
    metadata: item.metadata,
    collectionDescription: item.collectionDescription,
    gameDescription: item.gameDescription,
    itemDescription: item.itemDescription,
    source: item.source,
  }));
  return Item.insertMany(newItems);
};

exports.setSale = async (itemId, status, price, orderId) => {
  return Item.findOneAndUpdate({ _id: itemId }, { status, price, orderId }, { new: true }).select('+metadata');
};

exports.updateItemStatus = async (nftId, status) => {
  return Item.findOneAndUpdate({ nftId: nftId }, { status}, { new: true });
};

exports.updateNftOwner = async (nftId, nftOwner) => {
  return Item.findOneAndUpdate({ nftId: nftId }, { nftOwner}, { new: true });
};

exports.setPurchased = async (itemId, userId, nftOwner) => {
  return Item.findOneAndUpdate(
    { _id: itemId },
    { status: ITEM_STATUS.AVAILABLE, price: null, orderId: null, userId, nftOwner, seller: null },
    { new: true }
  ).select('+metadata');
};

exports.findById = async (itemId) => {
  return Item.findOne({ _id: itemId });
};

exports.setNftId = async (itemId, nftId, nftOwner) => {
  return Item.findOneAndUpdate({ _id: itemId }, { nftId: nftId, status: 1, nftOwner: nftOwner }, { new: true });
};

exports.updateDP = async (id, newDP) => {
  return Item.updateOne({ _id: id }, { 'attributes.dp': newDP });
};

exports.findByCollectionAndNFTId = async (collectionId, nftId) => {
  return Item.findOne({ collectionId: collectionId, nftId: nftId });
};

exports.getItems = async (condition, page) => {
  const options = {
    page: page,
    limit: 20,
    sort: { createdAt: -1 }
  };
  return Item.paginate(condition, options);
};

exports.getAllItemsByUserId = async (userId, collectionId) => {
  return Item.find({ userId, collectionId });
};
