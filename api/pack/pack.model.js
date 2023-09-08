const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const packSchema = new mongoose.Schema(
  {
    packId: {
      type: String,
      required: true,
      uniq: true,
      index: true
    },
    index: {
      type: Number,
      required: true,
      index: true
    },
    collectionId: {
      type: String,
      required: true
    },
    itemType: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    videoUrl: {
      type: String,
    },
    detail: {
      type: Object,
    },
    name: {
      type: String,
      required: true
    },
    gameDescription: {
      type: String,
      required: false
    },
    collectionDescription: {
      type: String,
      required: false
    },
    isHot: {
      type: Boolean,
      required: true
    },
    isNew: {
      type: Boolean,
      required: true
    },
    symbol: {
      type: String,
      required: true
    },
    amountInStock: {
      type: Number
    },
    maxAmountInStock: {
      type: Number
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    price: {
      type: Number,
      required: true
    },
    isSaleOnMarket: {
      type: Boolean,
      required: true
    },
    isSaleInGame: {
      type: Boolean,
      required: true
    },
    version: {
      type: Number,
      default: 1, // Integer number from 1
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    supressReservedKeysWarning: true
  }
);
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
packSchema.plugin(mongoosePaginate);

packSchema.index({ name: 'text', 'name': 'text' });
packSchema.index({ isSaleOnMarket: 1 });
packSchema.index({ isSaleInGame: 1 });

module.exports = mongoose.model('Pack', packSchema);
