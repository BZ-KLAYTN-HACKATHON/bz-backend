const mongoose = require('mongoose');

/**
 * LG NFT Order Schema
 * @private
 */
const peHeroOrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique:true,
    required: true,
    index: true
  },
  nftAddress: {
    type: String
  },
  tokenId: {
    type: String
  },
  price: {
    type: String
  },
  seller: {
    type: String
  },
  blockNumber: {
    type: Number
  },
  // NFT property. Used for filter
  nft: {
    type: Object
  },
  orderStatus: {
    type: String,
    default: 'Open',
    index: true
  }
});

module.exports = mongoose.model('peHeroOrder', peHeroOrderSchema);
