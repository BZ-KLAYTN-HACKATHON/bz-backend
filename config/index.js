let config = {};

if (process.env.NODE_ENV === 'test') {
  config = require('./test.json');
} else if (process.env.NODE_ENV === 'test-s2') {
  config = require('./test-s2.json');
} else {
  config = require('./test.json');
}

module.exports = config;
