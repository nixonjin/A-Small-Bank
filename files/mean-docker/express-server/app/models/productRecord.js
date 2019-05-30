var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the schema
var productRecord = new Schema({
    name: String,//产品名称
    money:{type:Number,default:0},//产品价格
    time: Number,//持续天数
    profit: Number,//利率
    ownerName:String 
});

module.exports = mongoose.model('ProductRecord',productRecord);
