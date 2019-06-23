const moment = require('moment');
const http = require('../framework/httpClient');
const Promise = require('bluebird');
const ta = require('ta-lib');
const MyIndicator = require('../indicator/MacdCross')
const db = require('../crud')
const Macd = require('../models/macd.model');
const config = require('../config');

// const BASE_URL = 'https://api.huobi.pro';
// 此地址用于国内不翻墙调试
const symbols = config['SYMBOLS'];
let t_Time = {};//临时存放时间戳，防止一直往数据库写数据，当时间大于period的时候才往数据库写数据
symbols.forEach(v=>t_Time[v] = 0); //INIT   t_Time
var orderbook = {};
exports.OrderBook = orderbook;

const isNewBar = (now,last) =>{
    let time_diff = (now - last)/60000;
    let periods = {"5min":5,"15min":15,"60min":60,"4hour":4*60,"1day":24*60};
    let minuts = periods[config['PERIOD']];
    return time_diff > minuts + 2; //增加两分钟避免延迟造成的重复插入数据库
}

const Save = (val) =>{ 
    if(val['cross'] == '金叉' || val['cross'] == '死叉' || val['zeroAxis'] == '上穿零轴' || val['zeroAxis']== '下穿零轴'){      
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

function handle(symbol,close0,cross,zeroAxis) {
    
    let res = {symbol:symbol,close0:close0,cross:cross,zeroAxis:zeroAxis,period:config['PERIOD']};
    // console.log(res);
    orderbook[symbol] = res;
    Save(res);
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
            
            let close = kline.map(v => v.close)  
            let MACD = ta.MACD(close,12,26,9);
            let dif = MACD.macd.slice(0,10);
            let dea = MACD.signal.slice(0,10);
            let macd = MACD.histogram.map((x)=> x*2).slice(0,10);           
            let [cross,zeroAxis] = [MyIndicator.IsCross(dif,dea),MyIndicator.IsBreakZero(macd)]
            handle(symbol, close[0],cross,zeroAxis);
            resolve(null);
        }).catch(ex => {
            //console.log('http请求 .catch is: ',symbol, ex);
            resolve(null);
        });
    });
}

function run() {
    // console.log(`run ${moment()}`);
    // console.log(config['PERIOD']);
    
    Promise.map(config['SYMBOLS'], item => {
        return get_kline(item);
    }).then(() => {
        setTimeout(run, 2000);
    });
}

run();












//-----------------------------------------------------------------------------------------//
function get_arr(symbol,kline){ //通过k线序列计算出数组，在前端页面展示
    
    let list_vol = [];
    let list_diff = [];
    // console.log(eos.data.length);
    for(let i =0;i < kline.length;i++)
    {
        list_vol.push(kline[i].amount) //amount
        list_diff.push(Math.abs(kline[i].close - kline[i].open));
    }
    let close0 = kline[0].close;
    // console.log('close0',close0);
    let close1 = kline[1].close;
    // console.log(Indicator.SMA(list, 5));
    // console.log(macd(list, 26, 12, 9));
    let vol_0 = list_vol.shift()
    let avg = average(list_vol);
    let bs = list_vol[0]/avg
    let data = {"symbol":symbol,"close0":close0,"close1":close1,"avg":avg,"vol_1":list_vol[0],"bs":bs,"diff":BREAKUP(list_diff)};
    return data;

}

var STDEVP = values => { 
    var avg = average(values)
    var squareDiffs = values.map(value => Math.pow(value - avg, 2))
    return Math.sqrt(average(squareDiffs))
  }

var BREAKUP = list =>{ //计算：最近K线实体长度/前面11根K线实体长度标准差的,反应突破强度
    let diff0 = list[0]; //最近一根K的实体长度
    list.shift()

    let result = STDEVP(list); //前面N根K的实体长度的标准差
    let ratio = (result == 0)?0:diff0/result;
    return ratio;

}