const mongoose = require('mongoose');

const packVersionSchema = new mongoose.Schema(
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
      type: String
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

module.exports = mongoose.model('PackVersion', packVersionSchema);

