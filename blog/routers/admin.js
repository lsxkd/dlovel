/**
 * Created by john on 2017/8/21.
 */
var express = require('express');
var router = express.Router();

var fs = require("fs");


var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');
var WebSetting = require('../models/WebSetting');
var WebBanner = require('../models/WebBanner');


//router.get('/user',function(req,res,next){
//    res.send('admin-User')
//});
router.use(function(req,res,next){
    if(!req.userInfo.isAdmin){
        //如果当前用户是非管理员
        res.send('对不起，只有管理员才可以进入后台管理');
        return;
    }
    next();
});

/**
 * 首页管理
 */
router.get('/',function(req,res,next){
    res.render('admin/index',{
        userInfo:req.userInfo
    });
});

/**
 * 网站基本设置
 */
router.get('/webSetting/set',function(req,res,next){
    var id = req.query._id || '';
    WebSetting.findOne().then(function(wenSetting){
        if(!wenSetting){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'指定内容不存在'
            });
            return Promise.reject();
        }else{
            //console.log(wenSetting);
            res.render('admin/webSetting',{
                userInfo:req.userInfo,
                wenSetting:wenSetting
            })
        }
    });

});

/**
 * 网站基本设置保存
 */
router.post('/webSetting/set',function(req,res,next){
    var ids = req.body.hidden_id || '';

    if(req.files[0]){ //判断是否有图片上传
        //上传图片部分
        var files_namess = req.files[0].originalname;
        var reg = /.*(?=\.\w)/;
        var newfilename = files_namess.replace(reg,"logo");
        var des_file = process.cwd() + "/public/images/logo/" + newfilename;
        var file_router = "/public/images/logo/" + newfilename;

        //更改文件名称
        //新文件的绝对路径
        var newpath = process.cwd() +  '/public/images/logo/'+newfilename;
        //新文件的相对路径
        var newpath_Logo = '/public/images/logo/'+newfilename;
        fs.rename(des_file,newpath,function(err){
            if(err){
                console.error("改名失败"+err);
            }
        });
        fs.readFile(req.files[0].path,function(err,data){
            fs.writeFile(newpath,data,function(err){
                if(err){
                    console.log(err);
                }else{
                }
            });
        });
    }else{
        newpath_Logo = req.body.logoalready
    }



    //网站基本设置保存数据到数据库
    WebSetting.update({
        _id: ids
    },{
        webName:req.body.webName,
        webSlogan:req.body.webSlogan,
        user:req.userInfo._id.toString(),
        webMessage:req.body.webMessage,
        webTitle:req.body.webTitle,
        webLogo:newpath_Logo,
        webKeywords:req.body.webKeywords,
        webDescription:req.body.webDescription,
        webUrl:req.body.webUrl,
        webIcp:req.body.webIcp,
        webMaster:req.body.webMaster,
        webQq:req.body.webQq,
        webMail:req.body.webMail,
        webTimes:req.body.webTimes,
        webCopyright:req.body.webCopyright

    }).then(function(rs){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'文章保存成功',
            url:'/admin'
        });
    });
});

/**
 * 网站banner列表
 */
router.get('/webSetting/banner',function(req,res,next){
    WebBanner.find().sort({bannerNo:1}).then(function(banners){
        res.render('admin/banner_index',{
            userInfo:req.userInfo,
            banners:banners
        });
    })
});



/**
 * 网站banner添加
 */
router.get('/webSetting/banner_add',function(req,res,next){
    res.render('admin/banner_add',{
        userInfo:req.userInfo
    })
});


/**
 * 网站banner设置保存
 */
router.post('/webSetting/banner_add',function(req,res,next){
    if(req.body.bannerNo == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'序号不能为空'
        });
        return false;
    }
    if(req.body.bannerName == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'名称不能为空'
        });
        return false;
    }
    if(req.body.bannerUrl == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'链接不能为空'
        });
        return false;
    }
    if(req.body.bannerUrl == 'http://'){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'链接不能为空'
        });
        return false;
    }
    if(req.files == ""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'图片不能为空'
        });
        return false;
    }

    //console.log(req);
    //上传图片部分
    var files_banner = req.files[0].originalname;
    var reg = /.*(?=\.\w)/;
    var newfilename = files_banner.replace(reg,"banner" + req.body.bannerNo);
    var des_file = process.cwd() + "/public/images/banner/" + newfilename;
    //var file_router = "/public/images/logo/" + newfilename;

    //更改文件名称
    //新文件的绝对路径
    var newpath = process.cwd() +  '/public/images/banner/'+newfilename;
    //新文件的相对路径
    var newpath_banners = '/public/images/banner/'+newfilename;
    fs.rename(des_file,newpath,function(err){
        if(err){
            console.error("改名失败"+err);
        }
    });
    fs.readFile(req.files[0].path,function(err,data){
        fs.writeFile(newpath,data,function(err){
            if(err){
                console.log(err);
            }else{
            }
        });
    });

    //保存网站banner设置数据到数据库

    WebBanner.findOne({
        bannerNo:req.body.bannerNo
    }).then(function(rs){
        if(rs){
            //数据库中已经存在该序号了
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'该序号已经存在!'
            });
            return Promise.reject();
        }else{
            //数据库中不存在该序号，可以保存
            return new WebBanner({
                bannerNo:req.body.bannerNo,
                bannerName:req.body.bannerName,
                bannerUrl:req.body.bannerUrl,
                bannerPath:newpath_banners
            }).save();
        }
    }).then(function(rsBanner){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'banner保存成功!',
            url:'/admin/webSetting/banner'
        })
    });

});


/**
 * banner修改
 */
router.get('/webSetting/banner_edit',function(req,res,next){
    //获取要修改的banner信息，并且用表单的形式显示出来
    var id = req.query.id || '';
    //获取要修改的banner信息
    WebBanner.findOne({
        _id:id
    }).then(function(WebBanners){
        if(!WebBanners){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'banner不存在!'
            });
        }else{
            res.render('admin/banner_edit',{
                userInfo:req.userInfo,
                WebBanners:WebBanners
            });
        }
    })
});

/**
 * banner修改内容保存
 */
router.post('/webSetting/banner_edit',function(req,res){
    var id = req.body.idsa || '';

    if(req.body.bannerNo == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'序号不能为空'
        });
        return false;
    }
    if(req.body.bannerName == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'名称不能为空'
        });
        return false;
    }
    if(req.body.bannerUrl == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'链接不能为空'
        });
        return false;
    }
    if(req.body.bannerUrl == 'http://'){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'链接不能为空'
        });
        return false;
    }
    if(req.files == ""){
        newpath_banners = req.body.hidden_path
    }else{
        //上传图片部分
        var files_banner = req.files[0].originalname;
        var reg = /.*(?=\.\w)/;
        var newfilename = files_banner.replace(reg,"banner" + req.body.bannerNo);
        var des_file = process.cwd() + "/public/images/banner/" + newfilename;
        //var file_router = "/public/images/logo/" + newfilename;

        //更改文件名称
        //新文件的绝对路径
        var newpath = process.cwd() +  '/public/images/banner/'+newfilename;
        //新文件的相对路径
        var newpath_banners = '/public/images/banner/'+newfilename;
        fs.rename(des_file,newpath,function(err){
            if(err){
                console.error("改名失败"+err);
            }
        });
        fs.readFile(req.files[0].path,function(err,data){
            fs.writeFile(newpath,data,function(err){
                if(err){
                    console.log(err);
                }else{
                }
            });
        });
    }

    WebBanner.findOne({
        _id:id
    }).then(function(WebBanners){
        if(!WebBanners){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在!'
            });
            return Promise.reject();
        }else{
            //要修改的分类名称是否已经在数据库中存在
            return WebBanner.findOne({
                _id:{$ne: id},
                bannerNo:req.body.bannerNo
            });

        }
    }).then(function(sameWebBanner){
        if(sameWebBanner){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'数据库中已经存在同名序号!'
            });
            return Promise.reject();
        }else{
            return WebBanner.update({
                _id: id
            },{
                bannerNo:req.body.bannerNo,
                bannerName:req.body.bannerName,
                bannerUrl:req.body.bannerUrl,
                bannerPath:newpath_banners
            });
        }
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'banner内容修改成功',
            url:'/admin/webSetting/banner'
        });
    })
});


/**
 * banner删除
 */
router.get('/webSetting/banner_delete',function(req,res){

    //获取要删除的分类id
    var id = req.query.id || '';

    WebBanner.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功!',
            url:'/admin/webSetting/banner'
        });
    })
});


/**
 * 用户管理
 */
router.get('/user',function(req,res,next){
    /**
     * 从数据库中读取所有用户的数据
     * limit(Number):限制获取数据的条数
     * skip(Number);忽略数据的条数
     * 每页显示2条
     * 1：1-2 skip:0 ->当前页-1*limit
     * 2：3-4 skio :2
     */
    var page = Number(req.query.page || 1);
    var limit = 10;

    var pages = 0;

    User.count().then(function(count){

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);
        var skip = ( page -1 ) * limit;

        User.find().limit(limit).skip(skip).then(function(users){
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:users,
                count:count,
                pages:pages,
                limit:limit,
                page:page
            });
        });
    });
});

/**
 * 用户的添加
 */
router.get('/user/add',function(req,res,next){
    res.render('admin/user_add',{
        userInfo:req.userInfo
    })
});
/**
 * 用户的保存
 */
router.post('/user/add',function(req,res,next){

    var username = req.body.username || "";
    var password = req.body.password || "";
    var isAdmin = req.body.isAdmin || "";

    if(username == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'用户名不能为空!'
        });
        return;
    }
    if(password == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'密码不能为空!'
        });
        return;
    }

    if(isAdmin == 0){
        isAdmin = true
    }else{
        isAdmin = false
    }
    //数据库中是否已经存在同名的用户名
    User.findOne({
        username:username
    }).then(function(rs){
        if(rs){
            //数据库中已经存在该用户了
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'用户名已经存在!'
            });
            return Promise.reject();
        }else{
            //数据库中不存在该用户，可以保存
            return new User({
                username:username,
                password:password,
                isAdmin:isAdmin
            }).save();
        }
    }).then(function(newUser){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'用户保存成功!',
            url:'/admin/user'
        })
    })
});


/**
 * 用户修改
 */
router.get('/user/edit',function(req,res,next){
    //获取要修改的用户信息，并且用表单的形式显示出来
    var id = req.query.id || '';
    //获取要修改的分类信息
    User.findOne({
        _id:id
    }).then(function(user){
        if(!user){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'用户不存在!'
            });
        }else{
            res.render('admin/user_edit',{
                userInfo:req.userInfo,
                user:user
            });
        }
    })
});
/**
 * 用户的修改保存
 */
router.post('/user/edit',function(req,res,next){
    //获取要修改的分类信息，并且用表单的形式显示出来
    var id = req.query.id || '';
    //获取post提交过来的名称
    var username = req.body.username || '';
    var password = req.body.password || "";
    var isAdmin = req.body.isAdmin || "";
    //console.log(isAdmin);
    if(username == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'用户名不能为空!'
        });
        return;
    }
    if(password == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'密码不能为空!'
        });
        return;
    }

    if(isAdmin == 0){
        isAdmin = true
    }else{
        isAdmin = false
    }
    //获取要修改的分类信息
    User.findOne({
        _id:id
    }).then(function(user){
        if(!user){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'用户信息不存在!'
            });
            return Promise.reject();
        }else{
            //当用户没有做任何修改提交的时候
            if(username == user.name && password == user.password && isAdmin == user.isAdmin){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'修改成功!',
                    url:'/admin/user'
                });
                return Promise.reject();
            }else{
                //要修改的分类名称是否已经在数据库中存在
                return User.findOne({
                    _id:{$ne: id},
                    username:username
                });
            }
        }
    }).then(function(sameUser){
        if(sameUser){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'数据库中已经存在同名用户!'
            });
            return Promise.reject();
        }else{
            return User.update({
                _id: id
            },{
                username:username,
                password:password,
                isAdmin:isAdmin
            });
        }
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功!',
            url:'/admin/user'
        });
    })
});

/**
 * 用户删除
 */
router.get('/user/delete',function(req,res){

    //获取要删除的分类id
    var id = req.query.id || '';

    User.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功!',
            url:'/admin/user'
        });
    })
});





/**
 * 分类首页
 */
router.get('/category',function(req,res,next){
    /**
     * 从数据库中读取所有分类的数据
     * limit(Number):限制获取数据的条数
     * skip(Number);忽略数据的条数
     * 每页显示2条
     * 1：1-2 skip:0 ->当前页-1*limit
     * 2：3-4 skio :2
     */
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Category.count().then(function(count){

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);
        var skip = ( page -1 ) * limit;
        /**
         * 1:升序
         * -1：降序
         */
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){
            res.render('admin/category_index',{
                userInfo:req.userInfo,
                categories:categories,
                count:count,
                pages:pages,
                limit:limit,
                page:page
            });
        });
    });
});
/**
 * 分类的添加
 */
router.get('/category/add',function(req,res,next){
    res.render('admin/category_add',{
        userInfo:req.userInfo
    })
});
/**
 * 分类的保存
 */
router.post('/category/add',function(req,res,next){

    var name = req.body.name || "";
    var classDescription = req.body.classDescription || "";
    if(name == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'名称不能为空!'
        });
        return;
    }
    //数据库中是否已经存在同名的分类名称
    Category.findOne({
        name:name
    }).then(function(rs){
        if(rs){
            //数据库中已经存在该分类了
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类已经存在!'
            });
            return Promise.reject();
        }else{
            //数据库中不存在该分类，可以保存
            return new Category({
                name:name,
                classDescription:classDescription
            }).save();
        }
    }).then(function(newCategory){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'分类保存成功!',
            url:'/admin/category'
        })
    })
});

/**
 * 分类修改
 */
router.get('/category/edit',function(req,res,next){
    //获取要修改的分类信息，并且用表单的形式显示出来
    var id = req.query.id || '';
    //获取要修改的分类信息
    Category.findOne({
        _id:id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在!'
            });
        }else{
            res.render('admin/category_edit',{
                userInfo:req.userInfo,
                category:category
            });
        }
    })
});

/**
 * 分类的修改保存
 */
router.post('/category/edit',function(req,res,next){
    //获取要修改的分类信息，并且用表单的形式显示出来
    var id = req.query.id || '';
    //获取post提交过来的名称
    var name = req.body.name || '';
    var classDescription = req.body.classDescription || "";
    //获取要修改的分类信息
    Category.findOne({
        _id:id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在!'
            });
            return Promise.reject();
        }else{
            //当用户没有做任何修改提交的时候
            if(name == category.name && classDescription == category.classDescription){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'修改成功!',
                    url:'/admin/category'
                });
                return Promise.reject();
            }else{
                //要修改的分类名称是否已经在数据库中存在
                return Category.findOne({
                   _id:{$ne: id},
                    name:name,
                    classDescription:classDescription
                });
            }
        }
    }).then(function(sameCategory){
        if(sameCategory){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'数据库中已经存在同名分类!'
            });
            return Promise.reject();
        }else{
            return Category.update({
                _id: id
            },{
                name:name,
                classDescription:classDescription
            });
        }
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功!',
            url:'/admin/category'
        });
    })
});

/**
 * 分类删除
 */
router.get('/category/delete',function(req,res){

    //获取要删除的分类id
    var id = req.query.id || '';

    Category.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功!',
            url:'/admin/category'
        });
    })
});

/**
 * 内容首页
 */
router.get('/content',function(req,res){
    /**
     * 从数据库中读取所有分类的数据
     * limit(Number):限制获取数据的条数
     * skip(Number);忽略数据的条数
     * 每页显示2条
     * 1：1-2 skip:0 ->当前页-1*limit
     * 2：3-4 skio :2
     */
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Content.count().then(function(count){

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);
        var skip = ( page -1 ) * limit;

        Content.find().sort({_id:-1}).limit(limit).skip(skip).populate(['category','user']).sort({
            addTime:-1
        }).then(function(contents){
            //console.log(contents);
            res.render('admin/content_index',{
                userInfo:req.userInfo,
                contents:contents,

                count:count,
                pages:pages,
                limit:limit,
                page:page
            });
        });
    });
});

/**
 * 内容添加页面
 */
var data_add;
router.use(function(req,res,next){//获取内容数量
    data_add = {
        userInfo:req.userInfo,
        categories:[]
    };
    Category.find().sort({_id:-1}).then(function(categories){
        data_add.categories = categories;
        next();
    });
});
router.get('/content/add',function(req,res){

    var where = {};
    if(data_add.category){
        where.category = data_add.category;
    }
    //读取所以的分类信息
    Content.where(where).count().then(function(count){

        data_add.count = count;
        return Content.where(where).find().sort({_id:-1}).populate(['category','user'])

    }).then(function(contents){
        data_add.contents = contents;
        //console.log(data);
        res.render('admin/content_add',data_add)
    });

    //Category.find().sort({_id:-1}).then(function(categories){
    //    res.render('admin/content_add',{
    //        userInfo:req.userInfo,
    //        categories:categories
    //    });
    //});
});

/**
 * 内容保存
 */
router.post('/content/add',function(req,res){
    if(req.body.category == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容分类不能为空'
        });
        return false;
    }
    if(req.body.title == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容标题不能为空'
        });
        return false;
    }
    if(req.body.description == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容简介不能为空'
        });
        return false;
    }
    if(req.body.content == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'文章内容不能为空'
        });
        return false;
    }
    //console.log(req);
    //上传图片部分
    var files_names = req.files[0].originalname;
    var des_file = process.cwd() + "/public/images/uploadimg/" + files_names;
    var file_router = "/public/images/uploadimg/" + files_names;
    //console.log(process.cwd());

    //更改文件名称
    var t = (new Date()).getTime();
    //生成随机数
    var ran = parseInt(Math.random() * 8999 +10000);
    //拼接文件名称
    var newfilename=t+ran+files_names;
    //新文件的绝对路径
    var newpath = process.cwd() +  '/public/images/uploadimg/'+newfilename;
    //新文件的相对路径
    var newpath_ss = '/public/images/uploadimg/'+newfilename;
    fs.rename(des_file,newpath,function(err){
        if(err){
            console.error("改名失败"+err);
        }
    });
    fs.readFile(req.files[0].path,function(err,data){
        fs.writeFile(newpath,data,function(err){
            if(err){
                console.log(err);
            }else{
            }
        });
    });

    //保存文章内容数据到数据库
    new Content({
        category:req.body.category,
        title:req.body.title,
        user:req.userInfo._id.toString(),
        description:req.body.description,
        conImages:newpath_ss,
        content:req.body.content,
        nos:req.body.count,
        keywords:req.body.keywords
    }).save().then(function(rs){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'文章保存成功',
            url:'/admin/content'
        });
    });
});



/**
 * 修改文章内容
 */
router.get('/content/edit',function(req,res){
    //console.log(req)
    //获取要修改的内容的信息，并且用表单的形式显示出来
    var id = req.query.id || '';

    var categories = [];
    //读取分类信息
    Category.find().sort({_id:-1}).then(function(rs){

        categories = rs;

        return Content.findOne({
            _id:id
        }).populate('category');
    }).then(function(content){

        if(!content){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'指定内容不存在'
            });
            return Promise.reject();
        }else{
            res.render('admin/content_edit',{
                userInfo:req.userInfo,
                categories:categories,
                content:content
            })
        }
    });
});
/**
 * 修改文章内容保存
 */
router.post('/content/edit',function(req,res){
    var id = req.body.idss || '';

    if(req.body.category == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容分类不能为空'
        });
        return;
    }
    if(req.body.title == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容标题不能为空'
        });
        return;
    }
    if(req.body.description == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容简介不能为空'
        });
        return;
    }
    if(req.body.content == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'文章内容不能为空'
        });
        return;
    }

    Content.update({
        _id:id
    },{
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content,
        keywords:req.body.keywords
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'文章内容修改成功',
            url:'/admin/content/edit?id=' + id
        });
    })
});

/**
 * 内容的删除
 */
router.get('/content/delete',function(req,res){
    var id = req.query.id || '';
    Content.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功!',
            url:'/admin/content'
        });
    })
});

/**
 * 评论首页
 */
router.get('/comment',function(req,res){
    /**
     * 从数据库中读取所有分类的数据
     * limit(Number):限制获取数据的条数
     * skip(Number);忽略数据的条数
     * 每页显示2条
     * 1：1-2 skip:0 ->当前页-1*limit
     * 2：3-4 skio :2
     */
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Content.count().then(function(count){

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);
        var skip = ( page -1 ) * limit;

        Content.find().sort({_id:-1}).limit(limit).skip(skip).populate(['category','user']).sort({
            addTime:-1
        }).then(function(contents){
            //console.log(contents);
            res.render('admin/comment_index',{
                userInfo:req.userInfo,
                contents:contents,

                count:count,
                pages:pages,
                limit:limit,
                page:page
            });
        });
    });
});



module.exports = router;