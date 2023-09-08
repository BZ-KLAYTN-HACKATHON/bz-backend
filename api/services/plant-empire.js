const axios = require('axios');
const config = require('../../config');
const BOX_TYPES = require('../../config/box-type.js');
const GIFT_TYPES = {
  'Chest S': {type: 'chestS', amount: 1},
  'Chest SS': { type: 'chestSS', amount: 1 },
  'Chest A': { type: 'chestA', amount: 1 },
  'Chest B': { type: 'chestB', amount: 1 },
  'Gold Ticket': { type: 'goldCard', amount: 1 },
  'Platinum Ticket': {type: 'platinumCard', amount: 1},
  'Herald Ticket': { type: 'heraldCard', amount: 1 },
  'Ruby Ticket': { type: 'rubyCard', amount: 1 },
  'Arena Ticket': { type: 'pvpticket', amount: 55 },
  'Gem': { type: 'gem', amount: 100 },
  'Gold': {type: 'gold', amount: 10000}
}

exports.spawnHero = async function (tokenId, star, rarity, classType, plantId, buyer) {
  const GET_PE_HERO_ATTRIBUTES_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/heros/getinfo/${tokenId}`;
  const GENERATE_PE_HERO_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/heros/pickhero`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  const validateStatus = function (status) {
    return status == 200 || status == 400 || status == 201;
  };
  try {
    const params = {
      nftId: tokenId,
      star: Number(star),
      rarity: Number(rarity),
      classType: Number(classType),
      plantId: Number(plantId),
      buyer: buyer
    };
    console.log("CALL", GENERATE_PE_HERO_URL, params);
    await axios.post(GENERATE_PE_HERO_URL, params, { auth, validateStatus });
    console.log('CREATE-HERO', tokenId, star, buyer);
    const response = (await axios.get(GET_PE_HERO_ATTRIBUTES_URL, { auth })).data;
    return Promise.resolve(response);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.upgradeStar = async function (tokenId, star) {
  const GET_GUARDIAN_ATTRIBUTES_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/heros/getinfo/${tokenId}`;
  const UP_STAR_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/heros/upstar/${tokenId}/${star}`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  try {
    await axios.get(UP_STAR_URL, { auth });
    console.log('URL', UP_STAR_URL);
  } catch (err) {
    console.log(err);
  } finally {
    const response = (await axios.get(GET_GUARDIAN_ATTRIBUTES_URL, { auth })).data;
    return Promise.resolve(response);
  }
};

exports.upgradeOrbStar = async function (tokenId, star) {
  const GET_ORB_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/orbs/getinfo/${tokenId}`;
  const UP_STAR_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/orbs/evolution/${tokenId}/${star}`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  try {
    await axios.get(UP_STAR_URL, { auth });
    console.log('URL', UP_STAR_URL);
  } catch (err) {
    console.log(err);
  } finally {
    // const response = (await axios.get(GET_ORB_URL, { auth })).data;
    return Promise.resolve();
  }
};

exports.updateHeroUserIdOnTransfer = async function (tokenId, owner) {
  const UPDATE_HERO_USER_ID_ON_TRANSFER_URL = `${config.LEGEND_GUARDIAN}/hero/updateUserId/${tokenId}?owner=${owner}`;
  const header = {
    headers: {
      Key: config.LEGEND_GUARDIAN_KEY
    }
  };
  return axios.post(UPDATE_HERO_USER_ID_ON_TRANSFER_URL, null, header);
};

exports.getGemPacks = async function () {
  const GET_GEM_PACKS_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/users/gemPacks`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  return axios.get(GET_GEM_PACKS_URL, { auth });
};

exports.getFarmShopPacks = async function () {
  const GET_FARM_SHOP_PACKS_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/users/getFarmShopPacks`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  return axios.get(GET_FARM_SHOP_PACKS_URL, { auth });
};

exports.getOrbsByWallet = async function (walletAddress) {
  const GET_ORBS_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/orbs/get/${walletAddress}`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  return axios.get(GET_ORBS_URL, { auth });
};

exports.getOrbsListForFusionByWallet = async function (walletAddress) {
  const GET_ORBS_LIST_FOR_FUSION_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/orbs/listForFusion/${walletAddress}`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  return axios.get(GET_ORBS_LIST_FOR_FUSION_URL, { auth });
};

exports.getHeroesListForFusionByWallet = async function (walletAddress) {
  const GET_HEROES_LIST_FOR_FUSION_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/heros/listForFusion/${walletAddress}`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  return axios.get(GET_HEROES_LIST_FOR_FUSION_URL, { auth });
};

exports.getCheckinDay = async function (walletAddress) {
  const GET_CHECKIN_DAY_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/users/checkinDay/${walletAddress}`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  return axios.get(GET_CHECKIN_DAY_URL, { auth });
};

exports.checkin = async function (walletAddress) {
  const GET_CHECKIN_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/users/checkin/${walletAddress}`;
  const validateStatus = function (status) {
    return status == 200 || status == 400 || status == 600;
  };
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  return axios.get(GET_CHECKIN_URL, { auth, validateStatus });
};

exports.claimTicket = async function (walletAddress) {
  const GET_CLAIM_TICKET_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/users/claimTicketMint/${walletAddress}`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  try {
    await axios.get(GET_CLAIM_TICKET_URL, { auth });
  } catch (err) {
    console.error(err);
    if (err.response.status == 400 && err.response.data.message == 'You have already claimed') {
      return
    } else {
      // throw err
    }
  }
};

exports.giftCard = async function (walletAddress, boxType, amount) {
  const type = BOX_TYPES[boxType].type;
  const GET_USER_GIFT_CARD = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/users/giftCard/${walletAddress}/${type}/${amount}`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  try {
    await axios.get(GET_USER_GIFT_CARD, { auth });
    console.log("GIFT-CARD", walletAddress, boxType, amount);
  } catch (err) {
    console.error(err);
    throw err;
/*
    if (err.response.status == 400 && err.response.data.message == 'You have already claimed') {
      return
    } else {
      throw err
    }
*/
  }
};

exports.mintOrb = async function (user, orbId, localId) {
  const MINT_ORB_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/orbs/mint/` + localId.replace(/\0/g, '');
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  const params = {
    nftId: orbId,
    address: user
  }

  try {
    await axios.get(MINT_ORB_URL, { auth, params: params });
  } catch (error) {
    if (error.response.status == 400 && error.response.data.message == 'This NFT was minted') {
      return
    } else {
      console.log('Mint Orb', error);
      throw error
    }
  }
};

exports.orbFusion = async function (walletAddress, nftId1, nftId2, newNFT, transactionHash, holypack, success) {
  const ORB_FUSION = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/orbs/fusion`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  const params = {
    walletAddress,
    nftId1,
    nftId2,
    newNFT,
    transactionHash,
    holypack,
    success
  }
  const validateStatus = function (status) {
    return status == 200 || status == 201 || status == 400;
  };

  try {
    await axios.post(ORB_FUSION, params,{ auth, validateStatus });
    console.log('ORB-FUSION', walletAddress, nftId1, nftId2, newNFT, transactionHash);
  } catch (error) {
    console.error('ERR: ORB-FUSION', error);
    throw error
  }
};

exports.eventGift = async function (transactionHash, walletAddress, titleMail, contentMail, name, eventName) {
  const EVENT_GIFT = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/event/gift/${walletAddress}`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  const gift = GIFT_TYPES[name];
  if (name == 'PEFI') return;
  if (!gift) {
    throw Error(`Invalid gift ${name} at ${transactionHash}`)
  }
  const params = {
    transactionHash,
    titleMail: titleMail,
    contentMail,
    type: gift.type,
    amount: gift.amount
  };
  const validateStatus = function (status) {
    return status == 200 || status == 201 || status == 400;
  };

  try {
    await axios.post(EVENT_GIFT, params,{ auth, validateStatus, params: { eventname: eventName} });
    console.log('GAME-SEVER:EVENT-GIFT', transactionHash, walletAddress, gift.type, gift.amount);
  } catch (error) {
    console.error('ERR: GAME-SEVER:EVENT-GIFT', error);
    throw error
  }
};

exports.getOrbInfoById = async function(nftId) {
  const GET_ORB_BY_ID_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/orbs/getinfo/${nftId}`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  return axios.get(GET_ORB_BY_ID_URL, { auth });
}

exports.sellOrb = async function (heroId) {
  const SELL_ORB_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/orbs/sell/${heroId}`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  const validateStatus = function (status) {
    return status == 200 || status == 404;
  };
  try {
    await axios.get(SELL_ORB_URL, { auth, validateStatus });
    return;
  } catch (e) {
    throw e;
  }
};

exports.stopSellOrb = async function (heroId) {
  const STOP_SELL_ORB_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/orbs/stopsell/${heroId}`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  const validateStatus = function (status) {
    return status == 200 || status == 404;
  };

  try {
    await axios.get(STOP_SELL_ORB_URL, { auth, validateStatus });
    return;
  } catch (e) {
    throw e;
  }
};

exports.buyPack = async function (transactionHash, buyer, packId, gem, blockNumber, buyAt) {
  const BUY_PACK_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/users/buypack`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  try {
    const params = {
      transactionHash,
      buyer,
      packId,
      gem,
      blockNumber,
      buyAt
    };
    await axios.post(BUY_PACK_URL, params, { auth });
    console.log('BUY PACK', transactionHash, buyer, packId);
  } catch (err) {
    if (err.response.status == 400 && err.response.data.message == 'The Gem number has been updated with the exchange rate, please try again!') {
      console.log('BUY PACK - Gem number updated', transactionHash, buyer, packId);
      return
    } else {
      throw err
    }
  }
};

exports.buyFarmShopPack = async function (transactionHash, buyer, packId, amount) {
  const BUY_FARM_SHOP_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/users/buyFarmShopPack`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  const PACK_MAPPING = {
    25: 'spinTurn1',
    26: 'spinTurn2',
    27: 'spinTurn3',
    28: 'water1',
    29: 'water2',
    30: 'water3'
  }
  try {
    const params = {
      transactionHash,
      buyer,
      packId: PACK_MAPPING[packId],
      amount,
    };
    await axios.post(BUY_FARM_SHOP_URL, params, { auth });
    console.log('BUY FARM SHOP PACK', transactionHash, buyer, packId);
  } catch (err) {
    if (err.response.status == 400) {
      console.log('Message', err.response.data.message);
      console.log('BUY FARM SHOP PACK - Gem number updated', transactionHash, buyer, packId);
      return
    } else {
      throw err
    }
  }
};

exports.buyOtherPack = async function (transactionHash, buyer, packId, pefiAmount) {
  const PACK_MAPPING = {
    7: '1B',
    8: '1A',
    9: '1S',
    10: '1SS',
    11: '2B_gold',
    12: '2A_platinum',
    13: '2S_platinum',
    14: '2SS_herald',
    15: '2SS_ruby',
  }
  const BUY_OTHER_PACK_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/users/buyChestIngame`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  try {
    const params = {
      transactionHash,
      buyer,
      packId: PACK_MAPPING[packId],
      pefi: pefiAmount
    };
    await axios.post(BUY_OTHER_PACK_URL, params, { auth });
    console.log('BUY OTHER PACK', transactionHash, buyer, packId);
  } catch (err) {
    if (err.response.status == 400) {
      console.log('BUY OTHER PACK - Gem number updated', transactionHash, buyer, packId);
      return
    } else {
      throw err
    }
  }
};

exports.buyPVPPack = async function (transactionHash, buyer, packId, pefiAmount) {
  const PACK_MAPPING = {
    16: 'pvp_rare_1',
    17: 'pvp_rare_2',
    18: 'pvp_rare_3',
    19: 'pvp_mythic_1',
    20: 'pvp_mythic_2',
    21: 'pvp_mythic_3',
    22: 'pvp_legend_1',
    23: 'pvp_legend_2',
    24: 'pvp_legend_3',
  }
  const BUY_PVP_PACK_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/users/buyPVPTicket`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  try {
    const params = {
      transactionHash,
      buyer,
      packId: PACK_MAPPING[packId],
      pefi: pefiAmount
    };
    await axios.post(BUY_PVP_PACK_URL, params, { auth });
    console.log('BUY PVP PACK', transactionHash, buyer, packId);
  } catch (err) {
    if (err.response.status == 400) {
      console.log('BUY PVP PACK - 400', transactionHash, buyer, packId);
      return
    } else {
      throw err
    }
  }
};

exports.stakeHeroFi = async function (transactionHash, address, type, nftId, star) {
  const STAKE_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/users/stake`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  try {
    const params = {
      address,
      type,
      nftId,
      star
    };
    await axios.post(STAKE_URL, params, { auth });
    console.log('STAKE-HEROFI', transactionHash, address, nftId, star);
  } catch (err) {
    if (err.response.status == 400 || err.response.status == 600) {
      console.log(`STAKE-HEROFI-${err.response.status}`, transactionHash, address, nftId, star);
      return;
    } else {
      throw err;
    }
  }
};

exports.sellHero = async function (heroId) {
  const SELL_HERO_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/heros/sell/${heroId}`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  const validateStatus = function (status) {
    return status == 200 || status == 404;
  };
  try {
    await axios.get(SELL_HERO_URL, { auth, validateStatus });
    return;
  } catch (e) {
    throw e;
  }
};

exports.stopSellHero = async function (heroId) {
  const STOP_SELL_HERO_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/heros/stopsell/${heroId}`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  const validateStatus = function (status) {
    return status == 200 || status == 404;
  };

  try {
    await axios.get(STOP_SELL_HERO_URL, { auth, validateStatus });
    return;
  } catch (e) {
    throw e;
  }
};

exports.changeOwner = async function (heroId, buyer) {
  const CHANGE_OWNER_HERO_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/heros/changeowner`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  const params = {
    nftId: heroId,
    buyer: buyer
  };
  const validateStatus = function (status) {
    return status == 200 || status == 404 || status == 201;
  };

  try {
    await axios.post(CHANGE_OWNER_HERO_URL, params, { auth, validateStatus });
    return;
  } catch (e) {
    throw e;
  }

};

exports.transferHero = async function (heroId, buyer) {
  const CHANGE_OWNER_HERO_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/heros/transfer`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  const params = {
    nftId: heroId,
    buyer: buyer
  };
  const validateStatus = function (status) {
    return status == 200 || status == 404 || status == 201;
  };

  try {
    await axios.post(CHANGE_OWNER_HERO_URL, params, { auth, validateStatus });
    return;
  } catch (e) {
    throw e;
  }

};

exports.transferOrb = async function (heroId, buyer) {
  const CHANGE_OWNER_ORB_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/orbs/transfer`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  const params = {
    nftId: heroId,
    buyer: buyer
  };
  const validateStatus = function (status) {
    return status == 200 || status == 404 || status == 201;
  };

  try {
    await axios.post(CHANGE_OWNER_ORB_URL, params, { auth, validateStatus });
    return;
  } catch (e) {
    throw e;
  }

};

exports.orbChangeOwner = async function (nftId, buyer) {
  const CHANGE_OWNER_HERO_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/orbs/changeowner`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  const params = {
    nftId: nftId,
    buyer: buyer
  };
  const validateStatus = function (status) {
    return status == 200 || status == 404 || status == 201;
  };

  try {
    await axios.post(CHANGE_OWNER_HERO_URL, params, { auth, validateStatus });
    return;
  } catch (e) {
    throw e;
  }

};

exports.getHeroInfoById = async function(nftId) {
  const GET_ORB_BY_ID_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/heros/getinfo/${nftId}`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  return axios.get(GET_ORB_BY_ID_URL, { auth });
}

exports.getHeroLevelId = async function(nftId) {
  const GET_ORB_BY_ID_URL = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/heros/level/${nftId}`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  return axios.get(GET_ORB_BY_ID_URL, { auth });
}

exports.hasAccount = async function(address) {
  const GET_USER_HAS_ACCOUNT = `${config.PLANT_EMPIRE_SERVER_BASE_URL}/users/has/${address}`;
  const auth = {
    username: config.PLANT_EMPIRE_USER_NAME,
    password: config.PLANT_EMPIRE_PASSWORD
  };
  return axios.get(GET_USER_HAS_ACCOUNT, { auth });
}
