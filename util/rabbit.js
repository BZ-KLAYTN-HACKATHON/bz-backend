var amqp = require('amqp-connection-manager');
const config = require('../config');

// Create a new connection manager
var connection = amqp.connect([config.RABBIT_MQ.HOST]);

// Ask the connection manager for a ChannelWrapper.  Specify a setup function to
// run every time we reconnect to the broker.
var channelWrapper = connection.createChannel({
  json: true,
  setup: function (channel) {
    // `channel` here is a regular amqplib `ConfirmChannel`.
    // Note that `this` here is the channelWrapper instance.
    return channel.assertQueue(config.RABBIT_MQ.HERO_FI_ITEM_CREATION, { durable: true });
  },
  publishTimeout: 6000
});

module.exports = channelWrapper;
