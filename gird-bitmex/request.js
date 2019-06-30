    
var request = require('request');
var crypto = require('crypto');

var apiKey = "Ol8zB3C1KtB7IGeMp1i6Y1si";
var apiSecret = "aKMNONbyhZavg8xwSsB9DzO3_3b1oruJdQrcSh9N9nNI3T97";


var verb = 'POST',
  path = '/api/v1/order',
  expires = new Date().getTime() + (60 * 1000), // 1 min in the future
  //data = {symbol:"XBTUSD",orderQty:1,price:590,ordType:"Limit"};
//   data = {symbol:"XBTUSD",orderQty:10,ordType:"Limit",side:'Buy',price:9000};
  data = {symbol:"XBTUSD",orderQty:10,ordType:"Stop",side:'Buy',stopPx:11532}; //
// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
var postBody = JSON.stringify(data);
//var signature = crypto.createHmac('sha256', apiSecret).update(verb + path +  postBody).digest('hex');
var signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');
// console.log(verb + path + expires + postBody);
var headers = {
  'content-type' : 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  // This example uses the 'expires' scheme. You can also use the 'nonce' scheme. See
  // https://www.bitmex.com/app/apiKeysUsage for more details.
  'api-expires': expires,
  'api-key': apiKey,
  'api-signature': signature
};

const requestOptions = {
  headers: headers,
  url:'https://testnet.bitmex.com'+path,
  method: verb,
  body: postBody,
  proxy:'http://127.0.0.1:1080'
};

request(requestOptions, function(error, response, body) {
    if (error) { console.log(error); }
    console.log(body);
  });

