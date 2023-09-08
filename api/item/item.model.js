const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const itemSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true
    },
    videoUrl: {
      type: String,
      required: true
    },
    nftId: {
      type: Number,
      index: true,
      unique: true,
      default: undefined,
      get: value => value ? value : null
    },
    collectionId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      default: null
    },
    orderId: {
      type: Number,
      default: null
    },
    nftOwner: {
      type: String,
      index: true,
      default: null
    },
    status: {
      type: String,
      // enum: [1,2,3, 4], // ['Available', 'Deposited', 'Selling', 'Staking'],
      default: 'Available'
    },
    server: {
      type: Number,
      default: 1
    },
    createdBy: {
      type: String,
      required: false
    },
    attributes: {
      type: Object,
      required: true
    },
    metadata: {
      type: Object,
      required: false,
      select: false
    },
    collectionDescription: {
      type: String
    },
    gameDescription: {
      type: String
    },
    itemDescription: {
      type: String
    },
    source: {
      type: String
    }
  },
  { timestamps: true, versionKey: false }
);
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
itemSchema.set('toJSON', {
  versionKey: false,
  getters: true
});
// Duplicate the ID field.

mongoosePaginate.paginate.options = {
  lean: true,
  customLabels: myCustomLabels,
};
itemSchema.plugin(mongoosePaginate);

itemSchema.index({ collectionId: 1, nftId: 1 });
itemSchema.index({ name: 'text', 'name': 'text' });

module.exports = mongoose.model('Item', itemSchema);
