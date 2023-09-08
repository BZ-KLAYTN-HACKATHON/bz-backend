const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

/**
 * User Schema
 * @private
 */
const orbTransactionSchema = new mongoose.Schema({
  transactionHash: String,
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
  buyer: {
    type: String
  },
  seller: {
    type: String
  },
  nft: {
    type: Object
  },
  price: {
    type: String
  },
  blockNumber: {
    type: Number,
    index: true
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
  meta: 'paginator',
};

mongoosePaginate.paginate.options = {
  lean: true,
  customLabels: myCustomLabels,
};
orbTransactionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('OrbTransaction', orbTransactionSchema);
