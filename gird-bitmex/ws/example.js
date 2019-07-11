'use strict';
const BitMEXClient = require('./index');
// See 'options' reference below
const client = new BitMEXClient({testnet: true, apiKeyID: 'Ol8zB3C1KtB7IGeMp1i6Y1si',apiKeySecret: 'aKMNONbyhZavg8xwSsB9DzO3_3b1oruJdQrcSh9N9nNI3T97'});
// handle errors here. If no 'error' callback is attached. errors will crash the client.
client.on('error', console.error);
client.on('open', () => console.log('Connection opened.'));
client.on('close', () => console.log('Connection closed.'));
client.on('initialize', () => console.log('Client initialized, data is flowing.'));

client.addStream('XBTUSD', 'order', function(data, symbol, tableName) {
  console.log(`Got update for ${tableName}:${symbol}. Current state:\n${JSON.stringify(data)}...`);
  // Do something with the table data...
});
