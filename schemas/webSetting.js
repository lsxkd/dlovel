/**
 * Created by john on 2017/9/18.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//网站基本设置的表结构
//var Schema = mongoose.Schema;
module.exports = new mongoose.Schema({

    //网站名称
    webName:{
        type:String,
        default:'蓝色星空岛'
    },
    //网站Slogan
    webSlogan:{
        type:String,
        default:'只要仰望星空，世界就会变得很大。'
    },
    //系统消息
    webMessage:{
        type:String,
        default:'欢迎来到蓝色星空岛'
    },
    //网站标题
    webTitle:{
        type:String,
        default:'蓝色星空岛'
    },
    //网站关键字
    webKeywords:{
        type:String,
        default:''
    },
    //网站描述
    webDescription:{
        type:String,
        default:''
    },
    //网站网址
    webUrl:{
        type:String,
        default:'http://www.dlovel.com'
    },
    //网站备案号
    webIcp:{
        type:String,
        default:''
    },
    //网站站长
    webMaster:{
        type:String,
        default:''
    },
    //站长QQ
    webQq:{
        type:String,
        default:''
    },
    //站长邮箱
    webMail:{
        type:String,
        default:''
    },
    //建站日期
    webTimes:{
        type:String,
        default:''
    },
    //版权信息
    webCopyright:{
        type:String,
        default:''
    },
    //网站logo
    webLogo:{
        type:String,
        default:''
    }

});
