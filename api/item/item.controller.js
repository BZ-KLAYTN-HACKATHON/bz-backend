const itemService = require('./item.service.js');
const map = require('lodash/map');
const { SuccessResponse, ErrorResponse } = require('../../util/response.js');
const { validationResult } = require('express-validator');
const { ITEM_STATUS } = require('../../config/constants.js');
const ROFI_MARKETPLACE_APPID = 'rofi_marketplace_be'
const ROFI_REFERRAL_APPID = 'rofi_referral'
/*
async function runCallback(appId, url, auth, requestBody) {
  try {
    const { data: responseData, status } = await axios({ method: 'post', url: url, data: requestBody, auth: auth });
    return callbackLogService.insertCallbackLog(appId, url, status, requestBody, responseData);
  } catch (error) {
    return callbackLogService.insertCallbackLog(appId, url, error.response?.status || -1, requestBody, error.response?.data);
  }
}
*/

/*
exports.deposit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
    }
    const { nftId, userId, transactionHash } = req.body;
    const { collectionId } = req.params;
    const { appId } = req.appInfo;
    const itemFound = await itemService.findByCollectionAndNFTId(collectionId, nftId);
    if (!itemFound) {
      return res.status(404).send(ErrorResponse(404, null, 'Item not found'));
    } else {
      if (itemFound.userId != userId) {
        return res.status(400).send(ErrorResponse(2101, null, 'userId and item\'s userId not match!'));
      } else {
        const transactionFound = await historyService.getTransactionHash(transactionHash);
        if (transactionFound) {
          return res.status(400).json(ErrorResponse(2011, errors.errors, 'transactionHash existed'));
        }
        const itemUpdated = await itemService.setSale(itemFound._id, 2);
        await historyService.insertHistory(userId, appId, 'deposit', itemUpdated, itemUpdated._id, 'Success', { transactionHash });
        const callbacks = await callbackService.findCallbacks('deposit', 'Success', collectionId);
        Promise.all(callbacks.map(cb => runCallback(cb.appId, cb.url, cb.auth, itemUpdated.toJSON()))).then();
        return res.status(200).send(SuccessResponse(itemUpdated))
      }
    }
  } catch (e) {
    logger.error(JSON.stringify(e),{ path: req?.route?.path });
    res.status(400).send(ErrorResponse(502, e.message, null));
  }
};

exports.withdraw = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
    }
    const { nftId, userId, transactionHash } = req.body;
    const { collectionId } = req.params;
    const { appId } = req.appInfo;
    const itemFound = await itemService.findByCollectionAndNFTId(collectionId, nftId);
    if (!itemFound) {
      return res.status(404).send(ErrorResponse(404, null, 'Item not found'));
    }
    if (itemFound.userId != userId) {
      return res.status(400).send(ErrorResponse(2101, null, 'userId and item\'s userId not match!'));
    }
    if (itemFound.status != ITEM_STATUS.DEPOSITED) {
      return res.status(200).send(ErrorResponse(2103, null, 'Item is not deposited'));
    }
    const transactionFound = await historyService.getTransactionHash(transactionHash);
    if (transactionFound) {
      return res.status(400).json(ErrorResponse(2011, errors.errors, 'transactionHash existed'));
    }
    const { data } = await idolWorldService.getItemDP(itemFound._id);
    if (data.code == 0) {
      const currentDP = data?.data?.dp;
      if (currentDP != itemFound.attributes.dp) {
        itemFound.attributes.dp = currentDP
        await itemService.updateDP(itemFound._id, currentDP);
      }
    }
    const callbacks = await callbackService.findCallbacks('withdraw', 'Success', collectionId);
    await Promise.all(callbacks.map(cb => runCallback(cb.appId, cb.url, cb.auth, itemFound
      .toJSON())));
    const itemUpdated = await itemService.setSale(itemFound._id, 1, null, null);
    await historyService.insertHistory(userId, appId, 'withdraw', itemUpdated, itemUpdated._id, 'Success', { transactionHash });
    return res.status(200).send(SuccessResponse(itemUpdated))
  } catch (e) {
    logger.error(JSON.stringify(e),{ path: req?.route?.path });
    res.status(400).send(ErrorResponse(502, e.message, null));
  }
};

*/
exports.getItems = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
    }
    const { collectionId } = req.params;
    const { page, name, nftOwner } = req.query;
    let condition = {
      collectionId,
      nftOwner
    }
    if (name) {
      condition['name'] = { $regex: name, '$options': 'i' };
    }
    const items = await itemService.getItems(condition, page);
    return res.status(200).send(SuccessResponse(items))
  } catch (e) {
    res.status(400).send(ErrorResponse(502, e.message, null));
  }
};

exports.getItemsByUserId = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
    }
    const { collectionId } = req.params;
    const { userId } = req.query;
    const items = await itemService.getAllItemsByUserId(userId, collectionId);
    return res.status(200).send(SuccessResponse(items))
  } catch (e) {
    res.status(400).send(ErrorResponse(502, e.message, null));
  }
};

exports.getItemById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
    }
    const { itemId } = req.params;
    let item = await itemService.findById(itemId);
    if (!item) {
      return res.status(404).send(ErrorResponse(404, null, 'Item not found'));
    }
/*
    const { data } = await idolWorldService.getItemDP(itemId);
    if (data.code == 0) {
      const currentDP = data?.data?.dp;
      if (currentDP != item.attributes.dp) {
        item.attributes.dp = currentDP
        await itemService.updateDP(item._id, currentDP);
      }
    }
*/
    return res.status(200).send(SuccessResponse(item));
  } catch (e) {
    res.status(400).send(ErrorResponse(502, e.message, null));
  }
};

exports.setItemAttributes = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
    }

    const attributes = req.body;
    const { itemId } = req.params;
    const result = await itemService.findOneAndUpdateDP(itemId, attributes.dp);
    return res.status(200).send(SuccessResponse(result));
  } catch (err) {
    return res.status(500).send(ErrorResponse(500, null, 'Internal server error'));
  }
}


exports.getItemByCollectionIdAndNftId = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
    }
    const { collectionId, nftId } = req.params;
    const item = await itemService.findByCollectionAndNFTId(collectionId, nftId);
    if (!item) {
      return res.status(404).send(ErrorResponse(404, null, 'Item not found'));
    }
    return res.status(200).send(SuccessResponse(item));
  } catch (e) {
    logger.error(JSON.stringify(e),{ path: req?.route?.path });
    res.status(400).send(ErrorResponse(502, e.message, null));
  }
};

exports.createItems = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
    }
    const body = req.body;
    const { collectionId } = req.params;
    const { appId } = req.appInfo;

    const items = map(body, item => {
      const imageUrl = `https://cdn-iw-02.rofi.io/item/${item.type}.jpg`;
      const videoUrl = `https://cdn-iw-02.rofi.io/videos/rg_01_01/${item.type}.mp4`;
      return { ...item, imageUrl, videoUrl, collectionId };
    })
    const itemsCreated = await itemService.createManyItems(collectionId, items);

    const histories = itemsCreated.map(item => ({
      appId, userId: item.userId,
      actionType: 'create',
      status: 'Success',
      itemId: item._id,
      item: item.toJSON(),
      metadata: item.metadata
    }));
    await historyService.insertHistories(histories);
    if (appId == ROFI_MARKETPLACE_APPID || appId == ROFI_REFERRAL_APPID) {// Item created from Marketplace -> Notify game to add item
      const callbacks = await callbackService.findCallbacks('deposit', 'Success', collectionId);
      itemsCreated.forEach(item => {
        Promise.all(callbacks.map(cb => runCallback(cb.appId, cb.url, cb.auth, item.toJSON()))).then();
      })
    }
    return res.status(200).send(SuccessResponse(itemsCreated));

    // Check balance
  } catch (e) {
    res.status(400).send(ErrorResponse(502, e.message, null));
  }
};

/*
exports.setItemSale = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
  }

  const { itemId, status, price, orderId } = req.body;
  const item = await itemService.findById(itemId);
  if (!item) {
    return res.status(404).send(ErrorResponse(404, null, 'Item not found'));
  } else {
    if (item.status != 1 && item.status != 3) {
      return res.status(200).send(ErrorResponse(2105, null, "Item not Selling or Available"))
    }
    const itemUpdated = await itemService.setSale(itemId, status, price, orderId);
    return res.status(200).send(SuccessResponse(itemUpdated))
  }
}

*/
/*
exports.purchaseItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
  }

  const { itemId, userId, newNftOwner } = req.body;
  const item = await itemService.findById(itemId);
  if (!item) {
    return res.status(404).send(ErrorResponse(404, null, 'Item not found'));
  } else {
    if (item.status != 1 && item.status != 3) {
      return res.status(200).send(ErrorResponse(2105, null, "Item not Selling or Available"))
    }
    const itemUpdated = await itemService.setPurchased(itemId, userId, newNftOwner);
    return res.status(200).send(SuccessResponse(itemUpdated))
  }
}

exports.mint = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(ErrorResponse(400, errors.errors, 'Invalid input'));
  }
  const { userId, itemId, nftId, transactionHash, nftOwner } = req.body;
  const { appId } = req.appInfo;
  const item = await itemService.findById(itemId);
  if (!item) {
    return res.status(404).send(ErrorResponse(404, null, 'Item not found'));
  } else {
    if (item.nftId) {
      return res.status(200).send(ErrorResponse(2102, null, 'Item minted', item));
    }
    const transactionFound = await historyService.getTransactionHash(transactionHash);
    if (transactionFound) {
      return res.status(400).json(ErrorResponse(2011, errors.errors, 'transactionHash existed'));
    }
    const itemByNFTId = await itemService.findByCollectionAndNFTId(item.collectionId, nftId);
    if (itemByNFTId) {
      return res.status(200).send(ErrorResponse(2103, null, 'nftId used', null));
    }
    if (userId != item.userId) {
      return res.status(200).send(ErrorResponse(2101, 'userId and item\'s userId not match!'));
    } else {
      const { data } = await idolWorldService.getItemDP(itemId);
      if (data.code == 0) {
        const currentDP = data?.data?.dp;
        if (currentDP != item.attributes.dp) {
          item.attributes.dp = currentDP
          await itemService.updateDP(item._id, currentDP);
        }
      }
      const callbacks = await callbackService.findCallbacks('mint', 'Success', item.collectionId);
      await Promise.all(callbacks.map(cb => runCallback(cb.appId, cb.url, cb.auth, item.toJSON()))).then();
      const itemUpdated = await itemService.setNftId(itemId, nftId, nftOwner);
      await historyService.insertHistory(
        userId,
        appId,
        'mint',
        itemUpdated,
        itemUpdated._id,
        'Success',
        { transactionHash }
      );
      return res.status(200).send(SuccessResponse(itemUpdated));
    }
  }
}

*/
