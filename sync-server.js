const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan')
const routes = require('./api/sync-routes');
const app = express();
const server = require('http').createServer(app);
const mongoose = require('./mongoose');
const bodyParser = require('body-parser');
const config = require('./config');

const port = process.env.PORT || config.SYNC_SERVER_PORT;

mongoose.connect()

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cors({credentials: true, origin: true}));
app.use(cors({ origin: '*' }));
// secure apps by setting various HTTP headers
app.use(helmet());
app.use(morgan('combined'))
// mount api v1 routes
app.use('/sync', routes);


server.listen(port, () => console.log(`HeroMarket service listening on ${port}`))
