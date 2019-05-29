var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the schema
var account = new Schema({ accountId: String,//用户id
    name: String,//用户名
    password: String,//密码
    telNumber: String,//电话
    property: { type: Number, min: 0, default: 0 },//定期存款
    products:[{type:Schema.Types.ObjectId,ref:'product'}]
    // huoqiProperty: { type: Number, min: 0, default: 0 }//活期存款
});

account.static = {
    findUserInfo: async (userName,userPwd) => {
        const userInfo = await this.findOne({name: userName}).exec();
        if(userInfo) {
            return userInfo.password == userPwd ? userInfo : null;
        } else {
            return null;
        }
    },
    createUser: async (userName,userPwd,userInfo = {}) => {
        const userInfo = await this.findOne({name: userName}).exec();
        if(userInfo){
            return null;
        }else{
            return this.create({
            ...userInfo,
            name: userName,
            password: userPwd
            });
        }

    },

    deposit: async (userId, method, amount) => {
        return /**/
    },

    withdrawal: async (userId, amount) => {
        return /**/
    }
}

module.exports = mongoose.model('Account', account);
