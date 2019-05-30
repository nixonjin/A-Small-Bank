var mongoose = require('mongoose');

// Define the schema
var account = new mongoose.Schema({
    accountId: mongoose.Schema.Types.ObjectId,//用户id
    name: String,//用户名
    password: String,//密码
    telNumber: String,//电话
    property: { type: Number, min: 0, default: 0 },//定期存款
    products:[{type:mongoose.Schema.Types.ObjectId,ref:'product'}]
    // huoqiProperty: { type: Number, min: 0, default: 0 }//活期存款
});

account.static = {
    findUserInfoById: async (userId) => {
        return /**/
    },

    deposit: async (userId, method, amount) => {
        return /**/
    },

    withdrawal: async (userId, amount) => {
        return /**/
    }
}

module.exports = mongoose.model('Account', account);
