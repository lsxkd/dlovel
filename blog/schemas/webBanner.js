/**
 * Created by john on 2017/9/25.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//分类的表结构
//var Schema = mongoose.Schema;

module.exports = new mongoose.Schema({
    //banner序号
    bannerNo:Number,
    //banner名称
    bannerName:String,
    //banner路径
    bannerPath:{
        type:String,
        default:''
    },
    //banner链接
    bannerUrl:{
        type:String,
        default:''
    }
});
