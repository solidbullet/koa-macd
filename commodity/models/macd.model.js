const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MacdSchema = new Schema({
  symbol: { type: String, required: true },
  //categoryId: { type: Schema.Types.ObjectId,required: true },  // 文章类别
  close0: { type: Number,default:0},                   // 文章形式 连载、原创、转载三种
  cross: { type: String ,default:'Waiting'},
  period: { type: String ,default:null},                                   // 原文链接
  zeroAxis: { type: String,default:'Waiting' },                        // 文章封面图
  createdAt: { type: Date, default: Date.now }
});

var Macd = mongoose.model('Macd', MacdSchema)

// 暴露接口
module.exports = Macd;