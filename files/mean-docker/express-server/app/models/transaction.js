var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the schema

var transaction = new Schema ({
        mainAccountName: String,//用户id
        type: String,//操作类型，只有定期存款，活期存款，取出，转账四种
        secondAccountName: String,//如果是转账则记录目标账户的id
        money: { type: Number, min: 0, default: 0 },//金额
        GMTtime: {type:Date,default:Date.now},//日期
})

transaction.statics = {
    findTsByName: async function(userName)  {
         var records = await this.find({mainAccountName: userName}).exec();
         return records;

     },
 }

// function mergeJSON (minor, main) {
//   for (var key in minor) {

//     if (main[key] === undefined) {  // 不冲突的，直接赋值
//       main[key] = minor[key];
//       continue;
//     }

//     // 冲突了，如果是Object，看看有么有不冲突的属性
//     // 不是Object 则以main为主，忽略即可。故不需要else
//     if (isJSON(minor[key])) {
//       // arguments.callee 递归调用，并且与函数名解耦
//       arguments.callee(minor[key], main[key]);
//     }
//   }
// }

module.exports = mongoose.model('Transaction', transaction );

