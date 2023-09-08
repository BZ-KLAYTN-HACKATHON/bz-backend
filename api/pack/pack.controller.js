const packService = require("./pack.service.js");
const packVersionService = require("./pack-version.service.js");
const { SuccessResponse, ErrorResponse } = require('../../util/response.js');
const forEach = require('lodash/forEach');
const startWith = require('lodash/startsWith');
const { validationResult } = require('express-validator');

exports.createPack = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
    }
    const {
      packId,
    } = req.body;
    const packFound = await packService.findByPackId(packId);
    if (packFound) {
      return res.status(400).send(ErrorResponse(4900, null, "pack exists"))
    }

    const newPack = await packService.createNewPack(req.body);
    return res
      .status(200)
      .send(SuccessResponse(newPack, 'Successfully'));
  } catch (err) {
    return res.status(500).send();
  }
};

exports.updatePack = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
    }
    const { packId } = req.params;
    const pack = await packService.findByPackId(packId);
    if (!pack) {
      return res
        .status(400)
        .send(ErrorResponse(4430, null, 'Pack not found!'));
    }

    const oldPack = pack.toJSON();
    delete oldPack._id
    await Promise.all([
      packVersionService.createNewPack(oldPack),
      packService.updatePack(pack._id, req.body)
    ]);

    return res.status(200).send(SuccessResponse(null, 'Successfully'));
  } catch (e) {
    return res
      .status(500)
      .send(ErrorResponse(500, null, 'Server error', null));
  }
};

exports.setPackDisabled = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
    }
    const { isDisabled } = req.body;
    const pack = await packService.findByPackId(packId);
    if (!pack) {
      return res
        .status(400)
        .send(ErrorResponse(4430, null, 'Pack not found!'));
    }

    await Promise.all([
      packService.setPackDisabled(pack._id, isDisabled)
    ]);

    return res.status(200).send(SuccessResponse(null, 'Successfully'));
  } catch (e) {
    return res
      .status(500)
      .send(ErrorResponse(500, null, 'Server error', null));
  }
};
exports.removePack = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
    }
    const { packId } = req.params;
    const pack = await packService.findByPackId(packId);
    if (!pack) {
      return res
        .status(400)
        .send(ErrorResponse(4430, null, 'Pack not found!'));
    }

    const oldPack = pack.toJSON();
    delete oldPack._id
    await Promise.all([
      packVersionService.createNewPack(oldPack),
      packService.removePack(pack._id, req.body)
    ]);
    return res.status(200).send(SuccessResponse(null, 'Successfully'));
  } catch (e) {
    return res
      .status(500)
      .send(ErrorResponse(500, null, 'Server error', null));
  }
};

exports.getPacks = async (req, res) => {
  try {
    const { page, sort, name } = req.query;
    let condition = { isDisabled: false, isSaleOnMarket: true };

    forEach(req.query, (value, key) => {
      if (key == 'name') {
        return condition['name'] = { $regex: value, '$options': 'i', $nin: ['gIDL', 'Diamond'] };
      }
      if (key == 'collectionId') {
        return condition[key] = { $in: Array.isArray(value) ? value : [value] };
      }
      if (startWith(key, 'detail.')) {
        const _values = Array.isArray(value) ? value : [value];
        const values = _values.map(e => {
          const num = parseInt(e);
          return isNaN(num) ? e : num;
        });

        return condition[key] = { $in: values};
      }
    })
    if (!name) {
      condition['name'] = {  $nin: ['gIDL', 'Diamond'] };
    } else if (name == 'gIDL') {
      condition['name'] = 'gIDL';
    } else if (name == 'Diamond') {
      condition['name'] = 'Diamond';
    }

    const packs = await packService.findWithPagination(
      condition,
      sort ? sort.replace(',', ' ') + ' -index' : '-index',
      page
    );
    res.status(200).send(SuccessResponse(packs, null));
  } catch (e) {
    console.log(e);
    res.status(500).send("Server error");
  }
};

exports.getPacksInGame = async (req, res) => {
  try {
    const { page, sort, name } = req.query;
    let condition = { isDisabled: false, isSaleInGame: true };

    forEach(req.query, (value, key) => {
      if (key == 'name') {
        return condition['name'] = { $regex: value, '$options': 'i', $nin: ['gIDL', 'Diamond'] };
      }
      if (key == 'collectionId') {
        return condition[key] = { $in: Array.isArray(value) ? value : [value] };
      }
      if (startWith(key, 'detail.')) {
        const _values = Array.isArray(value) ? value : [value];
        const values = _values.map(e => {
          const num = parseInt(e);
          return isNaN(num) ? e : num;
        });

        return condition[key] = { $in: values};
      }
    })
    if (!name) {
      condition['name'] = {  $nin: ['gIDL', 'Diamond'] };
    } else if (name == 'gIDL') {
      condition['name'] = 'gIDL';
    } else if (name == 'Diamond') {
      condition['name'] = 'Diamond';
    }

    const packs = await packService.findWithPagination(
      condition,
      sort ? sort.replace(',', ' ') + ' -index' : '-index',
      page
    );
    res.status(200).send(SuccessResponse(packs, null));
  } catch (e) {
    console.log(e);
    res.status(500).send("Server error");
  }
};

exports.getAllPacksAdmin = async (req, res) => {
  try {
    const { page, sort } = req.query;
    let condition = { };

    forEach(req.query, (value, key) => {
      if (key == 'name') {
        return condition['name'] = { $regex: value, '$options': 'i' };
      }
      if (key == 'collectionId') {
        return condition[key] = { $in: Array.isArray(value) ? value : [value] };
      }
      if (startWith(key, 'detail.')) {
        const _values = Array.isArray(value) ? value : [value];
        const values = _values.map(e => {
          const num = parseInt(e);
          return isNaN(num) ? e : num;
        });

        return condition[key] = { $in: values};
      }
    })

    const packs = await packService.findWithPagination(
      condition,
      sort ? sort.replace(',', ' ') + ' -index' : '-index',
      page
    );
    res.status(200).send(SuccessResponse(packs, null));
  } catch (e) {
    console.log(e);
    res.status(500).send("Server error");
  }
};

exports.countPacks = async (req, res) => {
  try {
    const countPacksPromises = this.nftAddresses.map((address) =>
      packService.countPacksByNFTAddress(address)
    );
    const packCounts = await Promise.all(countPacksPromises);
    const result = zipObject(this.games, packCounts);
    result.total = sum(packCounts);

    return res.status(200).send(SuccessResponse(result, null));
  } catch (e) {
    return res
      .status(500)
      .send(ErrorResponse(500, null, "Server error", null));
  }
};

exports.cancelPack = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
    }
    const { packId } = req.body;
    const pack = await packService.findByPackId(packId);
    if (!pack) {
      return res
        .status(400)
        .send(ErrorResponse(4430, null, "Pack not found!"));
    }
    if (pack.packStatus == "Filled") {
      return res
        .status(400)
        .send(
          ErrorResponse(441, null, "Cannot change status Filled to Cancelled")
        );
    }
    pack.packStatus = "Cancelled";
    await Promise.all([
      pack.save(),
    ]);
    return res.status(200).send(SuccessResponse(null, "Successfully"));
  } catch (e) {
    return res
      .status(500)
      .send(ErrorResponse(500, null, "Server error", null));
  }
};

exports.getPackById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
    }
    const { packId: id } = req.params;
    const pack = await packService.findByPackId(id);
    if (!pack) {
      return res
        .status(400)
        .send(ErrorResponse(4430, null, "Pack not found!"));
    }
    return res.status(200).send(SuccessResponse(pack, "Successfully"));
  } catch (e) {
    return res
      .status(500)
      .send(ErrorResponse(500, null, "Server error", null));
  }
};

exports.fillPack = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
    }
    const { packId, buyer } = req.body;
    const pack = await packService.findByPackId(packId);
    if (!pack) {
      return res
        .status(400)
        .send(ErrorResponse(4430, null, "Pack not found!"));
    }
    if (pack.packStatus == "Cancelled") {
      return res
        .status(400)
        .send(
          ErrorResponse(441, null, "Cannot change status Cancelled to Filled")
        );
    }
    pack.packStatus = "Filled";
    pack.buyer = buyer;
    await Promise.all([
      pack.save(),
    ]);
    return res.status(200).send(SuccessResponse(null, "Successfully"));
  } catch (e) {
    return res.status(500).send("Server error");
  }
};

