var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the schema
var product = new Schema({
    name: String,//产品名称
    money:Number,//产品价格
    time: Number,//持续天数
    profit: Number,//利率
    // buyers:[{type:mongoose.Schema.Types.ObjectId,ref:'account'}]
});


module.exports = mongoose.model('Product',product);
