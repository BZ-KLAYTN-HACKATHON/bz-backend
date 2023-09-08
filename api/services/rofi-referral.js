const axios = require('axios');
const config = require('../../config');

exports.addTransaction = async function (transactionType, wallet, transactionHash, price, moreInfo) {
  if (process.env.NODE_ENV != 'production-s2' && process.env.NODE_ENV != 'test-s2') return;
  const ADD_TRANSACTION = `${config.REFERRAL_SERVER_BASE_URL}/transactions/dapp`;
  const validateStatus = function (status) {
    return status !== 502 && status !== 404 && status !== 500;
  };
  const headers = {
    app_id: config.REFERRAL_SERVER_APP_ID,
    access_key: config.REFERRAL_SERVER_ACCESS_KEY
  }
  const params = {
    transactionType,
    wallet,
    transaction: transactionHash,
    price,
    moreInfo: JSON.stringify(moreInfo)
  };
  try {
    console.log('ADD TRANSACTION', params);
    await axios.post(ADD_TRANSACTION, params, { headers });
    return;
  } catch (e) {
    console.error("ERROR", e);
    throw e;
  }

};
