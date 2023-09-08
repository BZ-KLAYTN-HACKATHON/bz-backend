const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

/**
 * LG NFT Order Schema
 * @private
 */
const holyOrderSchema = new mongoose.Schema({
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

const myCustomLabels = {
  totalDocs: 'total',
  docs: 'data',
  limit: 'limit',
  page: 'currentPage',
  nextPage: 'next',
  prevPage: 'prev',
  pagingCounter: 'slNo',
  meta: 'paginator'
};

mongoosePaginate.paginate.options = {
  lean: true,
  customLabels: myCustomLabels
};
holyOrderSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Order', holyOrderSchema);
