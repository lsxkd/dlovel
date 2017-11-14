/**
 * Created by john on 2017/9/6.
 */
//加载编辑器
$(document).ready(function() {
    $('#summernote').summernote({
        height: 400,
        minHeight: 300,
        maxHeight: 500,
        focus: true,
        lang:'zh-CN',
        //// 重写图片上传
        //onImageUpload: function(files, editor, $editable) {
        //    sendFile(files[0],editor,$editable);
        //}
    });
    //获取编辑器内的HTML内容
    var str= $('#summernote').summernote('code');

    //给指定的编辑器设置HTML内容
    //var markupStr = 'hello world';
    //$('#summernote').summernote('code', markupStr);

    //内容提交
    //登录

    $("#content_form").find('button.submit_content').on('click',function(){

        var formData = new FormData($("#content_form")[0]);
        //var event = event || window.event;
        //event.preventDefault(); // 兼容标准浏览器
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/admin/content/add',
            data:{
                category:$("#category").find("option:selected").text(),
                title:$("#title").val(),
                description:$("#description").val(),
                conImages:$("#conImages").val(),
                contnet:$("#summernote").summernote('code')
            },
            dataType:'json',
            success:function(result){
                console.log( result.message );
                if(!result.code){
                    //登录成功
                    //setTimeout(function(){
                    //    $userInfo.show();
                    //    $loginBox.hide();
                    //    //显示登录用户的信息
                    //    $userInfo.find('.username').html(result.userInfo.username);
                    //    $userInfo.find('.info').html('你好，欢迎光临我的博客！');
                    //},1000)
                    //window.location.reload();
                }
            }
        })
    });




});


//图片上传
function sendFile(file, editor, $editable){

    var filename = false;
    try{
        filename = file['name'];
    } catch(e){
        filename = false;
    }
    if(!filename){
        $(".note-alarm").remove();
    }

    //以上防止在图片在编辑器内拖拽引发第二次上传导致的提示错误
    data = new FormData();
    data.append("file", file);
    data.append("key",filename); //唯一性参数

    $.ajax({
        data: data,
        type: "POST",
        url: "",
        cache: false,
        contentType: false,
        processData: false,
        success: function(url) {
            if(url=='200'){
                alert("上传失败！");
                return;
            }else{
                alert("上传成功！");
            }
            //alert(url);
            editor.insertImage($editable, url);
            //setTimeout(function(){$(".note-alarm").remove();},3000);
        },
        error:function(){
            alert("上传失败！");
            return;
            //setTimeout(function(){$(".note-alarm").remove();},3000);
        }
    });
}