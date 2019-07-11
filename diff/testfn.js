const db = require('./crud')
var Macd = require('./models/macd.model');
var macd_ltc = new Macd({
    symbol: 'ltcusdt',
    close0: 137,
    cross:'Waiting',
    zeroAxis:'Waiting'
});


// db.SaveCross(macd_ltc).then(v=> console.log(v))
// db.getBySymbol('trxusdt').then(v => {
//     let time = new Date()
//     console.log(time,v['createdAt'],(time - v['createdAt'])/60000) //分钟
//     })

// db.delAll().then(v => console.log(v))
// db.getAll().then(v => console.log(v))
db.get24hour(24).then(v => console.log(v))
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