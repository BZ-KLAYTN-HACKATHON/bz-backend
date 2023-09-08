const morgan = require('morgan');
const json = require('morgan-json');

morgan.token('body', (req, res) => JSON.stringify(req.body));
morgan.token('path', (req, res) => req?.route?.path);

const successResponseFormat = `:method :url :status :total-time ms :body`;

const format = json({
  short: successResponseFormat,
  responseTime: ':total-time',
  httpStatus: ':status',
  url: ':url',
  path: ':path',
});

const successHandler = morgan(format, {
  skip: (req, res) => res.statusCode >= 400,
});

const errorHandler = morgan(format, {
  skip: (req, res) => res.statusCode <= 401,
});

const warnHandler = morgan(format, {
  skip: (req, res) => res.statusCode != 400,
});

module.exports = {
  successHandler,
  errorHandler,
  warnHandler,
};
