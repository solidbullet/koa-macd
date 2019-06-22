require('./db/index');
var Macd = require('./models/macd.model');

// var Macd = new Macd({
//     symbol: 'eosusdt',
//     close0: 7,
//     cross:'Waiting',
//     zeroAxis:'Waiting'
// });



const addMany = async (model,arr) => await model.insertMany(arr,{ordered:true}).catch((error)=>console.log(error));
const SaveCross = async v => await v.save().catch((error)=>console.log(error));
const getBySymbol = async v => await Macd.find({symbol:v}).catch((error)=>console.log(error));
const getByPeriod = async v => await Macd.find({period:v}).catch((error)=>console.log(error));
const get24hour = async v => await Macd.where('createdAt').gte(new Date() - v*60*60*1000).catch((error)=>console.log(error));
const getAll = async () => await Macd.find({}).catch((error)=>console.log(error));
const delAll = async () => await Macd.deleteMany({}).catch((error)=>console.log(error));
const getlimit = async () => await Macd.where('symbol').in(['btcusdt', 'eosusdt', 'art']).limit(10).catch((error)=>console.log(error));

module.exports = {SaveCross,getBySymbol,getAll,delAll,addMany,getByPeriod,get24hour};



// let arr=[
//     {symbol:'tom',close0: 300.00,cross: new Date()},
//     {symbol:'jackson',close0: 700.00,cross: new Date(1970,3,15)},
//     {symbol:'alice',close0: 400.00,cross: new Date(1999,7,10)},
//     {symbol:'john',close0: 900.00,cross: new Date(1977,1,5)},
//     {symbol:'linus',close0: 1200.00,cross: new Date(1965,6,21)}
//     ]
// db.addMany(Macd,arr).then(v=> console.log(v))


// SaveCross(Macd).then(v => console.log(v))

// getBySymbol('eosusdt').then(v => console.log(v['cross']))
// getAll().then(v => console.log(v))
// getlimit().then(v => console.log(v))
// console.log('end')

// Macd.find({symbol:'btcusdt' }, function (err, docs) {
//     console.log(docs)
//   });


// Macd.save(function(err, doc) {
//         if (err) {
//             console.log('save error:' + err);
//         }

//         console.log('save sucess \n' + doc);
// })
