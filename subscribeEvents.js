const mongoose = require('./mongoose');
console.log("Environment: ", process.env.NODE_ENV);
mongoose.connect()
require('./subscribers/plant-empire-subscriber.js')
// require('./subscribers/plant-empire-independent-subscriber.js')
