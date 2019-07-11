const development = {
    PERIOD : '1day', //监控周期
    SYMBOLS:['eosusdt','btcusdt','ltcusdt','bsvusdt','xrpusdt','trxusdt','bttusdt','htusdt','linkusdt','topusdt','ethusdt','adausdt','xlmusdt'], //监控品种
    //,'ltcusdt','bsvusdt','xrpusdt','trxusdt','bttusdt','htusdt','ttusdt','topusdt','cvcusdt','btsusdt','paiusdt','ethusdt','atomusdt','irisusdt'
    SIZE:2,  //K线数量
    BASE_URL :'https://api.huobi.br.com',//基础网址
    PRICE_BREAK:10, //价格突破倍数，当前bar的实体长度/前size根bar的std标准差
    VOL_BREAK:10,//成交量突破倍数，当前bar的实体长度/前size根bar的std标准差
    VOL_BS:5 //当前成交量/前size根bar成交量平均值
}
module.exports = development