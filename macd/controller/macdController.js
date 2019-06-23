const ta = require('ta-lib');
const MyIndicator = require('../indicator/MacdCross')
const db = require('../crud')
const Macd = require('../models/macd.model');
const config = require('../config');

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
// { id: 1561285800,
//     open: 10625.76,
//     close: 10627.15,
//     low: 10622.71,
//     high: 10628.4,
//     amount: 10.935356762642934,
//     vol: 116198.0095185,
//     count: 244 }

const CALMACD = (symbol,k_arr) =>{
    let close = k_arr.map(v => v.close);
    let MACD = ta.MACD(close,12,26,9);
    let dif = MACD.macd.slice(0,10);
    let dea = MACD.signal.slice(0,10);
    let macd = MACD.histogram.map((x)=> x*2).slice(0,10);
    let [cross,zeroAxis] = [MyIndicator.IsCross(dif,dea),MyIndicator.IsBreakZero(macd)];
    let res = {symbol:symbol,close0:close[0],cross:cross,zeroAxis:zeroAxis,period:config['PERIOD']};
    return res;
    Save(res);
    // return k_arr;
}

const CALKDJ = (symbol) =>{
    console.log('symbol: ',symbol);
    // return k_arr;
}





// let t_Time = {};//临时存放时间戳，防止一直往数据库写数据，当时间大于period的时候才往数据库写数据
// crypto_symbols.forEach(v=>t_Time[v] = 0); //INIT   t_Time

// const isNewBar = (now,last) =>{
//     let time_diff = (now - last)/60000;
//     let periods = {"5min":5,"15min":15,"60min":60,"4hour":4*60,"1day":24*60};
//     let minuts = periods[global.PeriodFromCus];

//     return time_diff > minuts + 2; //增加两分钟避免延迟造成的重复插入数据库
// }

// const Save = (val) =>{ //{symbol:symbol,close0:close0,cross:cross,zeroAxis:zeroAxis,period:global.PeriodFromCus,createdAt:time};
//     if(val['cross'] == '金叉' || val['cross'] == '死叉' || val['zeroAxis'] == '上穿零轴' || val['zeroAxis']== '下穿零轴'){      
//         let time = new Date();
//         let symbol = val['symbol'];
//         if(isNewBar(time,t_Time[symbol])){ //t_time ,临时时间变量必须要放到对象，跟不同的币种对应，不然的话多币种共用一个变量就会出问题
//             t_Time[symbol]= time;
//             // val['createdAt'] = time;
//             let macd_signal = new Macd(val);
//             db.SaveCross(macd_signal).then(v=> {
//                 console.log(v);
//             })
//         } 
//     }
// }

// crypto_symbols.forEach (v =>  macd_res[v] = ws.OrderBook[v]);

module.exports = {CALMACD,CALKDJ};

