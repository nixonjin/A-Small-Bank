var mongoose = require('mongoose');

// Define the schema
var product = new mongoose.Schema({
    productId: mongoose.Schema.Types.ObjectId,//产品id
    name: String,//产品名称
    time: Number,//持续天数
    profit: Number,//利率
    buyers:[{type:mongoose.Schema.Types.ObjectId,ref:'account'}]
});


module.exports = mongoose.model('Product',product);
