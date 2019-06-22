const router = require('koa-router')()
const ws = require('../crawler/restkline');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: '数字货币MACD金叉死叉监控'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  let json = JSON.parse('{ "name":"runoob", "alexa":10000, "site":"www.runoob.com" }');
  ctx.body = json
})

router.get('/getjson', async (ctx, next) => {

  let url = ctx.url;
  let request = ctx.request;
  let req_query = request.query;
  // let req_queryString = request.queryString;
  global.PeriodFromCus = req_query['period'];
  
  let symbol = ['ttusdt','topusdt','cvcusdt','btsusdt','paiusdt','btcusdt','ethusdt','atomusdt','irisusdt','rsrusdt','bttusdt'];;//
  let data = symbol.map(v => ws.OrderBook[v]); 
  ctx.body = data  //JSON.stringify(data)
})

module.exports = router
