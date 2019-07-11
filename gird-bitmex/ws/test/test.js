'use strict';
var BitMEXClient = require('../index');

var client = new BitMEXClient({testnet: true , apiKeyID: 'Ol8zB3C1KtB7IGeMp1i6Y1si',apiKeySecret: 'aKMNONbyhZavg8xwSsB9DzO3_3b1oruJdQrcSh9N9nNI3T97',maxTableLen: 10000 });

client.addStream('XBTUSD', 'order', function(data, symbol, table) {
  console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
});

client.on('error', function(e) {
  console.error('Received error:', e);
});

