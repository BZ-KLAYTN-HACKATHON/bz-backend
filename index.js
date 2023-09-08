const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./api/routes');
const app = express();
const server = require('http').createServer(app);
const mongoose = require('./mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const port = process.env.PORT || config.SERVER_PORT || 4003;
const morgan = require('./util/morgan');

mongoose.connect()

// parse body params and attache them to req.body
app.use('/nfts', express.static('nfts'));
app.use(bodyParser.json());
app.use(morgan.successHandler);
app.use(morgan.errorHandler);
app.use(morgan.warnHandler);
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cors({credentials: true, origin: true}));
app.use(cors({ origin: '*' }));
// secure apps by setting various HTTP headers
app.use(helmet());
// mount api v1 routes
app.use('/', routes);


server.listen(port, () => console.log(`HeroMarket service listening on ${port}`))
