/**
 * Created by john on 2017/8/24.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//分类的表结构
//var Schema = mongoose.Schema;
module.exports = new mongoose.Schema({
    //分类名称
    name:String,
    //栏目描述
    classDescription:{
        type:String,
        default:''
    }

});
