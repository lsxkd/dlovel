/**
 * Created by john on 2017/9/6.
 */
//加载编辑器
$(document).ready(function() {
    $('#summernote').summernote({
        placeholder:'请输入内容',
        height: 400,
        minHeight: 300,
        maxHeight: 500,
        focus: true,
        lang:'zh-CN',
        // 重写图片上传
        //onImageUpload: function(files, editor, $editable) {
        //    sendFile(files[0],editor,$editable);
        //}
    });
    //获取编辑器内的HTML内容
    //var str= $('#summernote').summernote('code');



    $('#summernote_edit').summernote({
        height: 400,
        minHeight: 300,
        maxHeight: 500,
        focus: true,
        lang:'zh-CN',
    });


    //内容提交
    $("#content_form").find('button.submit_content').on('click',function(){
        if($("#title").val() == ""){
            //alert("标题不能为空");
            $(this).attr('data-content',"标题不能为空");
            $(this).popover('toggle');
            return false;
        }
        if($("#description").val() == ""){
            //alert("描述不能为空");
            $(this).attr('data-content',"描述不能为空");
            $(this).popover('toggle');
            return false;
        }
        if($("#conImages").val() == ""){
            //alert("图片未上传");
            $(this).attr('data-content',"图片未上传");
            $(this).popover('toggle');
            return false;
        }

        var formData = new FormData($("#content_form")[0]);
        formData.append("content", $("#summernote").summernote('code'));
        formData.append("count", $("#content_form").attr('counts'));

        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/admin/content/add',
            cache: false,
            data: formData,
            processData: false,
            contentType: false

        }).done(function(res) {
            console.log('成功');

            window.location.href='/admin/content/';

        }).fail(function(res) {
            console.log('失败')
        });

    });


    //给指定的编辑器设置HTML内容
    var datas = $(".cons_none_edit").attr("datas_edit");
    $('#summernote_edit').summernote('code', datas);
    //$(".cons_none_edit").remove();

    //修改内容提交
    $("#content_form_edit").find('button.submit_content_edit').on('click',function(){
        if($("#title").val() == ""){
            //alert("标题不能为空");
            $(this).attr('data-content',"标题不能为空");
            $(this).popover('toggle');
            return false;
        }
        if($("#description").val() == ""){
            //alert("描述不能为空");
            $(this).attr('data-content',"描述不能为空");
            $(this).popover('toggle');
            return false;
        }
        if($("#conImages").val() == ""){
            //alert("图片未上传");
            $(this).attr('data-content',"图片未上传");
            $(this).popover('toggle');
            return false;
        }

        var formData_edit = new FormData($("#content_form_edit")[0]);
        formData_edit.append("content", $("#summernote_edit").summernote('code'));
        formData_edit.append("idss", $("#content_form_edit").attr('data-ids'));

        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/admin/content/edit',
            cache: false,
            data: formData_edit,
            processData: false,
            contentType: false

        }).done(function(res) {
            console.log('成功');

            window.location.href='/admin/content/';

        }).fail(function(res) {
            console.log('失败')
        });

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