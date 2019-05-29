var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the schema
var transaction = new Schema ({
        recordId: String,//记录id
        mainAccountId: String,//用户id
        type: Number,//操作类型，只有定期存款，活期存款，取出，转账四种
        secondAccountId: String,//如果是转账则记录目标账户的id
        money: { type: Number, min: 0, default: 0 },//金额
        time: Date//日期
})

transaction.statics = {
    findTsById: async function(userId)  {
        var result1 = await this.find({mainAccountId: userId}).exec();
        var result2 = await this.find({secondAccountId: userId}).exec();
        mergeJSON(result2,result1);
        return result1;

    },
}

function mergeJSON (minor, main) {
  for (var key in minor) {

    if (main[key] === undefined) {  // 不冲突的，直接赋值
      main[key] = minor[key];
      continue;
    }

    // 冲突了，如果是Object，看看有么有不冲突的属性
    // 不是Object 则以main为主，忽略即可。故不需要else
    if (isJSON(minor[key])) {
      // arguments.callee 递归调用，并且与函数名解耦
      arguments.callee(minor[key], main[key]);
    }
  }
}

module.exports = mongoose.model('Transaction', transaction );
