/**
 * Created by john on 2017/8/21.
 */
var express = require('express');
var router = express.Router();

var fs = require("fs");


var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');


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
    console.log(isAdmin);
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
router.get('/content/add',function(req,res){

    Category.find().sort({_id:-1}).then(function(categories){
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            categories:categories
        });
    });
});

/**
 * 内容保存
 */
router.post('/content/add',function(req,res){
    var id = req.query._id || '';
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
    //if(req.files[0].originalname){
    //    return false;
    //}
    console.log(req);
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
        nos:req.body.nos
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
    var id = req.query.id || '';

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
        content:req.body.content
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

module.exports = router;