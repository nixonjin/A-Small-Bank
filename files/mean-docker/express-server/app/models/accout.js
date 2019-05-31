var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the schema

var account = new Schema({
    name: String,//用户名
    password: String,//密码
    telNumber: String,//电话
    property: { type: Number, min: 0, default: 0 },//存款
    investAmount:{ type: Number, min: 0, default: 0 },
    // products:[{type:mongoose.Schema.Types.ObjectId,ref:'product'}]
    products:[]
    // huoqiProperty: { type: Number, min: 0, default: 0 }//活期存款
});

account.statics = {
    createUser: async function(userName,userPwd,userInfo = {})  {
        console.log(userName);
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
    findUserAllInfo: async function(userName) {
        //const userInfo = await this.findOne({_id userId}).exec();
        const userInfo = await this.findOne({name: userName}).exec();

        if(!userInfo)   return null;

        return userInfo;
    },
}

module.exports = mongoose.model('Account', account);
