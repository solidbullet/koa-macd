const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TICKETSchema = new Schema({
  symbol: { type: String, required: true },
  //categoryId: { type: Schema.Types.ObjectId,required: true },  // 文章类别
  openprice: { type: Number,default:0},  
  closeprice: { type: Number,default:0}, 
  direct: { type: String ,default:null}, 
  status:{type: Number,default:0},
  createdAt: { type: Date, default: Date.now }
});

var TICKET = mongoose.model('TICKET', TICKETSchema)

// 暴露接口
module.exports = TICKET;

