var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the schema

var account = new Schema({
    accountId: Schema.Types.ObjectId,//用户id
    name: String,//用户名
    password: String,//密码
    telNumber: String,//电话
    property: { type: Number, min: 0, default: 0 },//定期存款
    products:[{type:Schema.Types.ObjectId,ref:'product'}]
    // huoqiProperty: { type: Number, min: 0, default: 0 }//活期存款
});

account.statics = {
    createUser: async function(userName,userPwd,userInfo = {})  {
        const user = await this.findOne({name: userName}).exec();
        if(user){
            return null;
        }else{
            return this.create({
            ...userInfo,
            name: userName,
            password: userPwd
            });
        }

    },
    findUserInfo: async function(userName,userPwd) {
        const userInfo = await this.findOne({name: userName}).exec();

        if(userInfo) {
            return userInfo.password == userPwd ? userInfo : null;
        } else {
            return null;
        }
    },
    findUserAllInfo: async function(userId) {
        //const userInfo = await this.findOne({_id userId}).exec();
        const userInfo = await this.find({_id:userId}).populate('products').exec();

        if(!userInfo)   return null;

        return userInfo;

    },
}

module.exports = mongoose.model('Account', account);
