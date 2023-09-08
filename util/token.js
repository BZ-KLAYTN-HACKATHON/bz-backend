
const BEP20ABI = [
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'from',
        'type': 'address'
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'to',
        'type': 'address'
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'value',
        'type': 'uint256'
      }
    ],
    'name': 'Transfer',
    'type': 'event'
  }
];
const abiDecoder = require('abi-decoder');
const map = require('lodash/map');
const BigNumber = require('bignumber.js'); // NodeJS
abiDecoder.addABI(BEP20ABI);

module.exports.getSumTokenTransfer = (transferLogs) => {
  const decodedLogs = abiDecoder.decodeLogs(transferLogs);
  const values = map(decodedLogs, 'events[2].value');
  const sum = BigNumber.sum.apply(null, values)
  return sum;
  // console.log(sum.div(new BigNumber('10').pow(18)).toFixed(2));
}
