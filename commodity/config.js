const development = {
    PERIOD : '5m', //监控周期
    SYMBOLS:['TA1909','RB1909','EG1909'], //监控品种
    SIZE:150,  //K线数量
    BASE_URL :'http://stock2.finance.sina.com.cn/futures/api/json.php',//基础网址
    PRICE_BREAK:10, //价格突破倍数，当前bar的实体长度/前size根bar的std标准差
    VOL_BREAK:10,//成交量突破倍数，当前bar的实体长度/前size根bar的std标准差
    VOL_BS:5 //当前成交量/前size根bar成交量平均值
}
module.exports = development