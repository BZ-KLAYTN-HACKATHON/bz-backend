const PackVersion = require('./pack-version.model.js');

exports.createNewPack = async (newPack) => {
  return PackVersion.create(newPack);
};
