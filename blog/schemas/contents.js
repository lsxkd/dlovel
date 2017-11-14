/**
 * Created by john on 2017/8/24.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//内容的表结构
//var Schema = mongoose.Schema;
module.exports = new mongoose.Schema({
    //关联字段 - 内容分类的id
    category:{
        //类别
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Category'
    },
    //内容标题
    title:String,
    //关联字段 - 用户id
    user:{
        //类别
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'User'
    },
    //时间
    addTime:{
        type:Date,
        default:new Date()
    },
    //点击量
    views:{
        type:Number,
        default:0
    },
    //简介
    description:{
        type:String,
        default:''
    },
    //内容
    content:{
        type:String,
        default:''
    },
    //评论内容
    comments:{
        type:Array,
        defaule:[]
    },
    //内容主图
    conImages:{
        type:String,
        default:''
    },
    //序号
    nos:{
        type:Number,
        default:0
    },
    //序号
    keywords:{
        type:String,
        default:""
    }

});
