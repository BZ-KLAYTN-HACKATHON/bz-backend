const VERSION = require('../models/version.model');

exports.getVersion = async (id) => {
  return VERSION.findOne({id: id})
};

