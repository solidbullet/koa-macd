const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const STDSchema = new Schema({
  symbol: { type: String, required: true },
  //categoryId: { type: Schema.Types.ObjectId,required: true },  // 文章类别
  close0: { type: Number,default:0},  
  diff: { type: Number,default:0}, 
  vol_breakup: { type: Number,default:0},                  // 文章形式 连载、原创、转载三种
  bs: { type: Number,default:0},
  direct: { type: String ,default:null}, 
  period: { type: String ,default:null},                       // 文章封面图
  createdAt: { type: Date, default: Date.now }
});

var STD = mongoose.model('STD', STDSchema)

// 暴露接口
module.exports = STD;

