var mongoose = require('mongoose');
mongoose.connect('mongodb://47.107.182.109/commodity', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));