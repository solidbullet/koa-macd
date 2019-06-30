const db = require('./crud')
var Ticket = require('./models/ticket.model');
var t1 = new Ticket({
    symbol: 'ltcusdt',
    openprice: 137,
    closeprice:138,
    direct:'buy'
});



// db.Save(t1).then(v=> console.log(v))
// db.getBySymbol('trxusdt').then(v => {
//     let time = new Date()
//     console.log(time,v['createdAt'],(time - v['createdAt'])/60000) //分钟
//     })

// db.delAll().then(v => console.log(v));
// db.getAll().then(v => console.log(v));
// db.get24hour(24).then(v => console.log(v))
// let date = new   Date();
// let time_test = '2019-06-21 15:14:00';
// let date0 = new Date(time_test);

// console.log(MyIndicator.onMonitor(date0));

// let arr=[
//     {symbol:'tom',close0: 300.00,cross: new Date()},
//     {symbol:'jackson',close0: 700.00,cross: new Date(1970,3,15)},
//     {symbol:'alice',close0: 400.00,cross: new Date(1999,7,10)},
//     {symbol:'john',close0: 900.00,cross: new Date(1977,1,5)},
//     {symbol:'linus',close0: 1200.00,cross: new Date(1965,6,21)}
//     ]
// db.addMany(Macd,arr).then(v=> console.log(v))


// db.getBySymbol('btcusdt',1).then(v => {
//     // db.UpdateStatus(v[0]['_id'],2).then(val => console.log(val));
//     console.log(v);
// })

db.getPositons('btcusdt','OP_SELL',0).then(v =>   console.log(v));
db.getPositons('btcusdt','OP_SELL',1).then(v =>   console.log(v));
