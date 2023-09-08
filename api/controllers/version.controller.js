const VERSION = require('../models/version.model');
const versionService = require('../services/version.service.js');

exports.getVersion = async (id) => {
  return VERSION.findOne({id: id})
};

exports.updateToBlock = async (id, toBlock) => {
   return VERSION.updateOne({id: id}, { toBlock: toBlock})
};

exports.createVersion = async (id, toBlock) => {
  return VERSION.create({id: id, toBlock: toBlock})
};

exports.getLatestVersion = async (req, res) => {
  try {
    const version = await versionService.getVersion('1');
    res.status(200).send(version.toBlock.toString());
  } catch (err) {
    res.status(200).send(err);
  }
}

