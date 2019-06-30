
const http = require('../framework/httpClient');
const Promise = require('bluebird');
const MyIndicator = require('../indicator/MacdCross')
const db = require('../crud')
const Ticket = require('../models/ticket.model');
const config = require('../config');
const ta = require('ta-lib');

const [GRIDDISTANCE,GRIDMAXNUM] = [10,5];
var orderbook = {};

exports.OrderBook = orderbook;
// const BASE_URL = 'https://api.huobi.pro';
// 此地址用于国内不翻墙调试



function handle(symbol,close,trade_direct) {
    console.log('price',close);
    db.getPositons(symbol,trade_direct,0).then(v => {
        let count  = v.length;    
        if(count == 0){
            let ticket = new Ticket({
                symbol:symbol,
                openprice:close,
                direct:trade_direct
            });
            db.Save(ticket).then(v=>  console.log(symbol + " save success!"));
        }else{
            let lastprice = v[count - 1]['openprice'];
            let diff = close - lastprice;
            if(trade_direct == 'OP_BUY'){
                if(diff < -GRIDDISTANCE && count < GRIDMAXNUM){
                    let ticket = new Ticket({
                        symbol:symbol,
                        openprice:close,
                        direct:trade_direct
                    });
                    db.Save(ticket).then(v=> console.log(symbol + " save success!"));
                }else if(diff > GRIDDISTANCE){
                    db.UpdateStatus(v[count - 1]['_id'],1).then(val => console.log('触发UpdateStatus函数，最新价超过上一单一格： ',val)); //将已经止盈的status字段改为1的话，就查不出来了
                }
            }
            if(trade_direct == 'OP_SELL'){
                if(diff > GRIDDISTANCE && count < GRIDMAXNUM){
                    let ticket = new Ticket({
                        symbol:symbol,
                        openprice:close,
                        direct:trade_direct
                    });
                    db.Save(ticket).then(v=> console.log(symbol + ' DIRECT: ',trade_direct, " save success!"));
                }else if(diff < -GRIDDISTANCE){
                    db.UpdateStatus(v[count - 1]['_id'],1).then(val => console.log('触发UpdateStatus函数，最新价超过上一单一格： ',val)); //将已经止盈的status字段改为1的话，就查不出来了
                }
            }

        } 
    })
    // console.log(ticket.openprice);
    // if(ticket.openprice == 0){
    //     ticket.symbol = symbol;
    //     ticket.openprice = close;
    //     db.Save(ticket).then(v=> {
    //         ticket.openprice = close;
    //         console.log("save success");
    //     })

    // }
    
    // orderbook[symbol] = res;
    // Save(res);
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
            
            let close = kline.map(v => v.close)  
            let MACD = ta.MACD(close,12,26,9);
            let dif = MACD.macd.slice(0,10);
            let dea = MACD.signal.slice(0,10);
            let macd_bar = MACD.histogram.slice(0,10).map((x)=> x*2);  
            let trade_direct = (macd_bar[0] > 0 )?'OP_BUY':'OP_SELL';    
            // console.log(trade_direct);  
            //let [cross,zeroAxis] = [MyIndicator.IsCross(dif,dea),MyIndicator.IsBreakZero(macd_bar)]; //isbreakzero 会吧k线0号位置（也就是第一个数据）删掉

            
            handle(symbol, close[0],trade_direct);
            resolve(null);
        }).catch(ex => {
            //console.log('http请求 .catch is: ',symbol, ex);
            resolve(null);
        });
    });
}

function run() {
    // console.log(`run ${moment()}`);   
    // let symbols = ['btcusdt','eosusdt'];
    // Promise.map(symbols, item => {
    //     return get_kline(item);
    // }).then(() => {
    //     setTimeout(run, 2000);
    // });

    get_kline('btcusdt').then(() => {
        setTimeout(run, 2000);
    });
}

run();

