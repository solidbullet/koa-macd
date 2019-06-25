const moment = require('moment');
const http = require('../framework/httpClient');
const Promise = require('bluebird');
const timeblock  = require('../tools/TimeBlock');
const CAL_TOOL = require('../tools/caculator')
const config = require('../config');
const db = require('../crud')
const STD = require('../models/std.model');

const symbols = config['SYMBOLS'];
// let time_test = '2019-06-21 14:14:00';
// let date0 = new Date(time_test);
// if(!timeblock.onMonitor(new Date())) return;

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
            let STD_signal = new STD(val);
            db.SaveCross(STD_signal).then(v=> {
                console.log(v);
            })
        } 
    }
}
function get_arr(symbol,kline){ //通过k线序列计算出数组，在前端页面展示 
    let list_vol = [];
    let list_diff = [];
    // 依次是行情时间0，开盘价1、最高价2、最低价3、收盘价4、成交量5。
    for(let i =0;i < kline.length;i++)
    {
        let [open,close,vol] = [parseFloat(kline[i][1]),parseFloat(kline[i][4]),parseFloat(kline[i][5])];
        list_vol.push(vol) //成交量
        list_diff.push(Math.abs(close - open));
    }
    let close0 = parseFloat(kline[0][4]);
    let close1 = parseFloat(kline[1][4]);
    let vol_0 = list_vol.shift()
    let avg = CAL_TOOL.AVERAGE(list_vol);
    let bs = (avg != 0 )?list_vol[0]/avg:0;
    let diff = CAL_TOOL.BREAKUP(list_diff);
    let vol_breakup = CAL_TOOL.BREAKUP(list_vol);
    let direct = '';
    direct = (close0 > close1)?'上涨':'下跌';
    let data = {"symbol":symbol,"close0":close0,"close1":close1,"avg":avg,"vol_1":list_vol[0],"bs":bs,"diff":diff,'vol_breakup':vol_breakup,'period':config['PERIOD'],direct:direct};
    console.log(data)
    return data;
}

// http://stock2.finance.sina.com.cn/futures/api/json.php/IndexService.getInnerFuturesMiniKLine5m?symbol=TA1909
// 依次是行情时间，开盘价、最高价、最低价、收盘价、成交量。

var orderbook = {};

exports.OrderBook = orderbook;


function handle(symbol, kline) {
    
    orderbook[symbol] = get_arr(symbol,kline);
    // console.log(orderbook[symbol])
}

function get_kline(symbol) {
    return new Promise(resolve => {
        let url = `${config['BASE_URL']}/IndexService.getInnerFuturesMiniKLine5m?symbol=${symbol}`;
        // console.log(url);
        http.get(url, {
            timeout: 2000,
            gzip: true
        }).then(data => {
            // console.log(data);
            let json = JSON.parse(data).slice(0,12);
            // console.log(typeof(json[0]));
            // console.log(json);
            handle(symbol, json);
            resolve(null);
        }).catch(ex => {
            // console.log('http请求 .catch is: ',symbol, ex);
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

