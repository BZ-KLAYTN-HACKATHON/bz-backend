const mongoose = require('./mongoose');
mongoose.connect()
require('./subscribers/plant-empire-deposit-subscriber.js')
