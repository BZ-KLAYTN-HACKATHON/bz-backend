const mongoose = require('mongoose');
const { mongo } = require('./config');
const env = process.env.NODE_ENV;
let MONGO_URI;

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_PREFIX, DB_NAME} = process.env;
let DATABASE_BASE_URI;
if (DB_HOST && DB_PORT && DB_USER && DB_PASSWORD) {
  if (DB_PREFIX == 'mongodb+srv') {
    DATABASE_BASE_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}`;
  } else {
    DATABASE_BASE_URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;
  }
  MONGO_URI = `${DATABASE_BASE_URI}/${DB_NAME}?authSource=admin&retryWrites=true&w=majority`;
} else {
  DATABASE_BASE_URI = `mongodb://localhost`;
  MONGO_URI = mongo.uri
}

// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// print mongoose logs in dev env
if (env !== 'production') {
  // mongoose.set('debug', true);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
  console.log(`Mongoose connect to ${MONGO_URI}`);
  mongoose
    .connect(mongo.uri, {
      keepAlive: 1,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('mongoDB connected...'));
  return mongoose.connection;
};
