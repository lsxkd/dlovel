/**
 * Created by john on 2017/8/21.
 */
var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');
var WebSetting = require('../models/WebSetting');
var WebBanner = require('../models/WebBanner');

var data;
/**
 *处理通用数据
 */
router.use(function(req,res,next){
    data = {
        userInfo:req.userInfo,
        categories:[]
    };
    Category.find().then(function(categories){
        data.categories = categories;
        next();
    });
});

//网站基本设置
router.use(function(req,res,next){
    WebSetting.findOne().then(function(webSetting){
        //console.log(webSetting);
        data.webSetting = webSetting;
        next();
    })
});
//网站banner设置
router.use(function(req,res,next){
    WebBanner.find().then(function(webBanners){
        console.log(webBanners);
        data.webBanners = webBanners;
        next();
    })
});

/**
 * 首页
 */
router.get('/',function(req,res,next){

    /**
     * 从数据库中读取所有分类的数据
     * limit(Number):限制获取数据的条数
     * skip(Number);忽略数据的条数
     * 每页显示2条
     * 1：1-2 skip:0 ->当前页-1*limit
     * 2：3-4 skio :2
     */
    //data = {
    //    //userInfo:req.userInfo,
    //    category:req.query.category || '',
    //    //categories:[],
    //    count:0,
    //    page: Number(req.query.page || 1),
    //    limit: 2,
    //    pages: 0
    //};
    data.category = req.query.category || '';
    data.count = 0;
    data.page =  Number(req.query.page || 1);
    data.limit =  10;
    data.pages =  0;


    var where = {};
    if(data.category){
        where.category = data.category;
    }


    //读取所以的分类信息
    Content.where(where).count().then(function(count){

        data.count = count;
        //计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        //取值不能超过pages
        data.page = Math.min(data.page,data.pages);
        //取值不能小于1
        data.page = Math.max(data.page,1);
        var skip = ( data.page -1 ) * data.limit;

        return Content.where(where).find().sort({_id:-1}).limit(data.limit).skip(skip).populate(['category','user']).sort({
            addTime:-1
        });


    }).then(function(contents){
        data.contents = contents;
        //console.log(data);
        res.render('main/index',data)
    });
});

/**
 * 详情页路由
 */
router.get('/view',function(req,res){

    data.category = req.query.category || '';
    var contentId = req.query.contentid || '';
    Content.findOne({
        _id:contentId
    }).populate(['category','user']).then(function(content){
        data.content = content;

        content.views++;
        content.save();
        //console.log(data)
        res.render('main/view',data);
    })

});

/**
 * 搜索
 */
router.get('/search',function(req,res,next){
    //console.log(req.query);

    data.category = req.query.category || '';
    data.count = 0;
    data.page =  Number(req.query.page || 1);
    data.limit =  10;
    data.pages =  0;

    var where = {};
    if(data.category){
        where.category = data.category;
    }

    var conditions = req.query.keywords;
    var criteria = {}; // 查询条件keywords : conditions
    if(conditions) {
        criteria['keywords']=new RegExp(conditions);//模糊查询参数
    }
    var criteria2 = {}; // 查询条件keywords : conditions
    if(conditions) {
        criteria2['title'] = new RegExp(conditions);
    }
    var options  = {};
    data.searchKeywords = req.query.keywords;
    //读取所以的分类信息
    Content.where(where).count().then(function(count){

        data.count = count;
        //计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        //取值不能超过pages
        data.page = Math.min(data.page,data.pages);
        //取值不能小于1
        data.page = Math.max(data.page,1);
        var skip = ( data.page -1 ) * data.limit;

        return Content.where(where).find({ '$or' : [criteria,criteria2]}).sort({_id:-1}).limit(data.limit).skip(skip).populate(['category','user']).sort({
            addTime:-1
        });

    }).then(function(contents){
        data.contents = contents;
        //console.log(data);
        res.render('main/search',data)
    });

});









module.exports = router;