
const http = require('../framework/httpClient');
const Promise = require('bluebird');
const CAL_TOOL = require('../indicator/caculator')
const db = require('../crud')
const STD = require('../models/std.model');
const config = require('../config');

var orderbook = {};

exports.OrderBook = orderbook;
// const BASE_URL = 'https://api.huobi.pro';
// 此地址用于国内不翻墙调试

function ad_sell() {
    let url_sell = 'https://otc-api.eiijo.cn/v1/data/trade-market?coinId=1&currency=1&tradeType=sell&currPage=1&payMethod=0&country=37&blockType=general&online=1&range=0';
    return new Promise(resolve => {
        http.get(url_sell, {
            timeout: 2000,
            gzip: true
        }).then(data => {
            let json = JSON.parse(data);
            resolve(json.data);
        }).catch(ex => {
            resolve(null);
        });
    });
}

function ad_buy() {
    let url_buy = 'https://otc-api.eiijo.cn/v1/data/trade-market?coinId=1&currency=1&tradeType=buy&currPage=1&payMethod=0&country=37&blockType=general&online=1&range=0';
    return new Promise(resolve => {
        http.get(url_buy, {
            timeout: 2000,
            gzip: true
        }).then(data => {
            let json = JSON.parse(data);
            resolve(json.data);
        }).catch(ex => {
            resolve(null);
        });
    });
}

function get_kline(symbol) {
    return new Promise(resolve => {
        
        let url = `${config['BASE_URL']}/market/history/kline?period=${config['PERIOD']}&size=${config['SIZE']}&symbol=${symbol}`; //${global.PeriodFromCus}
        // console.log(url);
        http.get(url, {
            timeout: 2000,
            gzip: true
        }).then(data => {
            let json = JSON.parse(data);
            let t = json.ts;
            let kline = json.data;  
            resolve(kline);
        }).catch(ex => {
            resolve(null);
        });
    });
}

// function run() {
//     Promise.map(symbols, item => {
//         return get_kline(item);
//     }).then(() => {
//         setTimeout(run, 2000);
//     });
// }

// run();


// get_kline('btcusdt').then(data => console.log(data))
async function task() {
    // let first =  await get_kline('btcusdt');
    // let buy  = await ad_buy();
    // let sell = await ad_sell();
    let res = await Promise.all([get_kline('btcusdt'), ad_buy(),await ad_sell()]);

    // let close0 = res[0][0].close;
    // let close1 = res[0][1].close;
    // let rise = (close1)?100*(close0 - close1)/close1:0;

    // let buy_data = res[1].slice(0,3);
    orderbook['btcusdt'] = res;
    }


async function run() {
    await task();
    setTimeout(() => {
      run();
    }, 2000);
}
  run();