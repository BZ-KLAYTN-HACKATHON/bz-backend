const BigNumber = require('bignumber.js');
const decimals = (new BigNumber(10)).pow(18);

module.exports.toHumanNumber = function (bigNumString) {
  return new BigNumber(bigNumString).div(decimals).toFixed(2);
}
