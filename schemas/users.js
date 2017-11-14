/**
 * Created by john on 2017/8/21.
 */

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//用户的表结构
//var Schema = mongoose.Schema;
module.exports = new mongoose.Schema({
    //用户名
    username:String,
    //密码
    password:String,
    //是否是管理员
    isAdmin:{
        type:Boolean,
        default:false
    },
    //时间
    userTime:{
        type:Date,
        default:new Date()
    }
});
