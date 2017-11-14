/**
 * Created by john on 2017/8/29.
 */

var prepage = 10;
var page = 1;
var pages = 0;
var comments = [];

//提交评论
$('#comment-submit').on('click',function(){
    if($('#comment_nickname').val() == "" ){
        $("#comment_tips").show();
        $("#tips_html").html("昵称不能为空");
        setTimeout(function(){
            $("#comment_tips").hide();
            $("#tips_html").html("");
        },3000);
        return
    }

    if($('#comment-textarea').val() == "" ){
        $("#comment_tips").show();
        $("#tips_html").html("评论内容不能为空");
        setTimeout(function(){
            $("#comment_tips").hide();
            $("#tips_html").html("");
        },3000);
        return
    }
    $.ajax({
        type:'POST',
        url:'/api/comment/post',
        data:{
            contentid:$('#contentId').val(),
            content:$('#comment-textarea').val(),
            nickname:$('#comment_nickname').val(),
            mail:$('#comment_mail').val()
        },success:function(responseData){
            //console.log(responseData)
            $(".comment-success").show();
            setTimeout(function(){
                $(".comment-success").hide();
            },2000);
            $('#comment-textarea').val('');
            $('#comment_nickname').val('');
            $('#comment_mail').val('');
            comments = responseData.data.comments.reverse();
            renderContent();
        }
    })
});
//每次页面重载的时候获取一下文章所有的评论
$.ajax({
    url:'/api/comment',
    data:{
        contentid:$('#contentId').val()
    },
    success:function(responseData){
        //console.log(responseData)
        comments = responseData.data.reverse();
        renderContent();
    }
});

$('.pagination').delegate('a','click',function(){
    if($(this).parent().hasClass('prev-page')){
        page--;
    }else{
        page++;
    }
    renderContent();
});


function renderContent(){

    $('#messageCount').html(comments.length);

    pages = Math.max(Math.ceil(comments.length / prepage),1);
    var start = Math.max(0,(page-1) * prepage);
    var end = Math.min(start + prepage,comments.length);
    var $lis = $('.pagination li');
    $lis.eq(1).html('<span>'+page + '/' + pages + '</span>');
    if( page <= 1){
        page = 1;
        $lis.eq(0).html('<span>没有上一页了</span>')
    }else{
        $lis.eq(0).html('<a href="javascript:;">上一页</a>')
    }
    if(page >= pages){
        page = pages;
        $lis.eq(2).html('<span>没有下一页了</span>')
    }else{
        $lis.eq(2).html('<a href="javascript:;">下一页</a>')
    }
    if(comments.length == 0){
        $('#comment_list').html( '<li style="margin:20px auto;text-align:center;"><span>还没有评论</span></li>');
    }else{
        var html = '';
        for(var i= start,len= end;i < len;i++){
            html += '<li class="comment-content">' +
                '<span class="comment-f">#'+ i +'</span>' +
                '<div class="comment-main"><p><a class="address" href="javascript:;" rel="nofollow" target="_blank">昵称：'+ comments[i].nickname + '&nbsp;&nbsp;&nbsp;&nbsp;(用户名：' + comments[i].username +')</a>' +
                '<span class="time">('+formatDate(comments[i].postTime) +')</span><br>'+ comments[i].content +'</p>'+
                '</div>'+
                '</li>'
        }
        $('#comment_list').html(html)
    }

}

//格式化时间
function formatDate(d){
    var date1 = new Date(d);
    return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + ' ' + date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds()
}


