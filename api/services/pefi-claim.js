const axios = require('axios');
const config = require('../../config');

exports.claimToken = async function (user, requestId, transactionHash) {
  if (process.env.NODE_ENV != 'production-s2' && process.env.NODE_ENV != 'test-s2') return;
  const GET_CLAIM_TOKEN = `${config.CLAIM_SERVER_BASE_URL}/request/onClaimToken`;
  const validateStatus = function (status) {
    return status !== 502 && status !== 404 && status !== 500;
  };
  const params = {
    user,
    requestId,
    transactionHash
  };
  try {
    await axios.post(GET_CLAIM_TOKEN, params, { validateStatus });
    console.log('CLAIM-TOKEN: ', user, requestId, transactionHash);
    return;
  } catch (e) {
    throw e;
  }

};

exports.mintHoly = async function (user, packageId, holyType, createdAt) {
  if (process.env.NODE_ENV != 'production-s2' && process.env.NODE_ENV != 'test-s2') return;
  const MINT_HOLY_URL = `${config.CLAIM_SERVER_BASE_URL}/holy/onMint`;
  /*
    const auth = {
      username: config.PLANT_EMPIRE_USER_NAME,
      password: config.PLANT_EMPIRE_PASSWORD
    };
  */
  const params = {
    user: user,
    packageId: packageId,
    holyType,
    createdAt
  };
  const validateStatus = function (status) {
    return status !== 502 && status !== 404 && status !== 500;
  };

  try {
    await axios.post(MINT_HOLY_URL, params, { validateStatus });
    console.log("CALL-PEFI-CLAIM:On-Mint", user, packageId, holyType, createdAt);
    return;
  } catch (e) {
    throw e;
  }

};

