/**
 * Created by john on 2017/8/21.
 */

$(function(){
    var $loginBox = $('#loginBox');
    var $registerBox = $('#registerBox');
    var $userInfo = $('#userInfo');
    //切换到注册页面
    $loginBox.find("a.login_btns").on('click',function(){
        $loginBox.hide();
        $registerBox.show();
    });
    //切换到登陆页面
    $registerBox.find("a.login_btns").on('click',function(){
        $registerBox.hide();
        $loginBox.show();
    });
    //注册
    $registerBox.find('button').on('click',function(){
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$registerBox.find('[name="username"]').val(),
                password:$registerBox.find('[name="password"]').val(),
                repassword:$registerBox.find('[name="repassword"]').val()
            },
            dataType:'json',
            success:function(result){
                //console.log(result);
                $registerBox.find('.register_tips').html( result.message );

                if(!result.code){
                    //注册成功
                    setTimeout(function(){
                        $loginBox.show();
                        $registerBox.hide();
                    },1000)
                }
            }
        });




    });
    $(document).keyup(function(event){//点击enter键登陆
        if(event.keyCode ==13){
            $loginBox.find('button').click();
        }
    });
    //登录
    $loginBox.find('button').on('click',function(){
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$loginBox.find('[name="username"]').val(),
                password:$loginBox.find('[name="password"]').val()
            },
            dataType:'json',
            success:function(result){
                $loginBox.find('.register_tips').html( result.message );
                if(!result.code){
                    //登录成功
                    //setTimeout(function(){
                    //    $userInfo.show();
                    //    $loginBox.hide();
                    //    //显示登录用户的信息
                    //    $userInfo.find('.username').html(result.userInfo.username);
                    //    $userInfo.find('.info').html('你好，欢迎光临我的博客！');
                    //},1000)
                    window.location.reload();
                }
            }
        })
    });
    $('#logout').on('click',function(){
        $.ajax({
            url:'/api/user/logout',
            success:function(result){
                if(!result.code){
                    window.location.reload();
                }
            }
        });
    });

    //搜索
    $("#search_form").find('button.search_btn').on('click',function(){
        if($("#keywords").val() == ""){
            alert("关键字不能为空");
            return;
        }
    });



});

