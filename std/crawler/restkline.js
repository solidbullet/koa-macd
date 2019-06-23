const moment = require('moment');
const http = require('../framework/httpClient');
const Promise = require('bluebird');
const CAL_TOOL = require('../indicator/caculator')
const db = require('../crud')
const Macd = require('../models/macd.model');
const config = require('../config');

var orderbook = {};

exports.OrderBook = orderbook;
// const BASE_URL = 'https://api.huobi.pro';
// 此地址用于国内不翻墙调试
const symbols = config['SYMBOLS'];
let t_Time = {};//临时存放时间戳，防止一直往数据库写数据，当时间大于period的时候才往数据库写数据
symbols.forEach(v=>t_Time[v] = 0); //INIT   t_Time

const isNewBar = (now,last) =>{
    let time_diff = (now - last)/60000;
    let periods = {"5min":5,"15min":15,"60min":60,"4hour":4*60,"1day":24*60};
    let minuts = periods[config['PERIOD']];
    return time_diff > minuts + 2; //增加两分钟避免延迟造成的重复插入数据库
}

const Save = (val) =>{ 
    if(val['bs'] >= config['VOL_BS']  || val['diff'] >= config['PRICE_BREAK'] || val['vol_breakup'] >= config['VOL_BREAK']){      
        let time = new Date();
        let symbol = val['symbol'];
        if(isNewBar(time,t_Time[symbol])){ //t_time ,临时时间变量必须要放到对象，跟不同的币种对应，不然的话多币种共用一个变量就会出问题
            t_Time[symbol]= time;
            // val['createdAt'] = time;
            let macd_signal = new Macd(val);
            db.SaveCross(macd_signal).then(v=> {
                console.log(v);
            })
        } 
    }
}
function get_arr(symbol,kline){ //通过k线序列计算出数组，在前端页面展示 
    let list_vol = [];
    let list_diff = [];
    
    for(let i =0;i < kline.length;i++)
    {
        list_vol.push(kline[i].amount) //amount
        list_diff.push(Math.abs(kline[i].close - kline[i].open));
    }
    let close0 = kline[0].close;
    let close1 = kline[1].close;
    let vol_0 = list_vol.shift();
    
    let avg = CAL_TOOL.AVERAGE(list_vol);
    let bs = (avg != 0 )?list_vol[0]/avg:0;
    let diff = CAL_TOOL.BREAKUP(list_diff);
    let vol_breakup = CAL_TOOL.BREAKUP(list_vol);
    let direct = '';
    direct = (close0 > close1)?'上涨':'下跌';
    let data = {"symbol":symbol,"close0":close0,"close1":close1,"avg":avg,"vol_1":list_vol[0],"bs":bs,"diff":diff,'vol_breakup':vol_breakup,'period':config['PERIOD'],direct:direct};
    
    return data;
}

function handle(symbol, kline) {
    let res = get_arr(symbol,kline);
    orderbook[symbol] = res;
    Save(res);
    // console.log(orderbook[symbol]);

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
            
            handle(symbol, kline);
            resolve(null);
        }).catch(ex => {
            //console.log('http请求 .catch is: ',symbol, ex);
            resolve(null);
        });
    });
}

function run() {
    // console.log(`run ${moment()}`);   
    Promise.map(symbols, item => {
        return get_kline(item);
    }).then(() => {
        setTimeout(run, 2000);
    });
}

run();

