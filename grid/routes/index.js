const router = require('koa-router')()
const ws = require('../crawler/restkline');
const config = require('../config');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: '量价突破监控'
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
  // global.PeriodFromCus = req_query['period'];
  
  
  let data = config['SYMBOLS'].map(v => ws.OrderBook[v]);  //ws.OrderBook[v]
  // console.log('data',data)
  ctx.body = data  //JSON.stringify(data)
})

module.exports = router
