const AVERAGE = arr => arr.reduce((acc, val) => acc + val, 0) / arr.length;

const STDEVP = values => { 
    let avg = AVERAGE(values)
    let squareDiffs = values.map(value => Math.pow(value - avg, 2))
    return Math.sqrt(AVERAGE(squareDiffs))
  }

const BREAKUP = list =>{ //计算：最近K线实体长度/前面11根K线实体长度标准差的,反应突破强度   
    let diff0 = list[0]; //最近一根K的实体长度
    list.shift()
    let result = STDEVP(list); //前面N根K的实体长度的标准差
    let ratio = (result == 0)?0:diff0/result;
    // console.log(ratio);
    return ratio;
}

module.exports = {STDEVP,BREAKUP,AVERAGE};
