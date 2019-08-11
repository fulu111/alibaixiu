$.ajax({
    type:'get',
    url:'/categories',
    success:function(res) {
        // console.log(res);
        let html = template('categoryTpl',{list:res});
        $('#category').html(html);
    }
})
$('#feature').on('change',function(){
    let fileData = this.files[0];
    //图片是二进制数据 ajax本身不支持二进制数据上传
    let formData = new FormData();
    formData.append('file',fileData);
    //发送ajax
    $.ajax({
        type:'post',
        url:'/upload',
        data:formData,
        //让$.ajax不要解析请求参数
        processData:false,
        //让$.ajax不要设置请求参数的类型
        contentType:false,
        success:function(res){
            // console.log(res);
            //将数据保存到隐藏域中 是为了将数据添加到集合中 隐藏域是一个表单标签
            $('#thumbnail').val(res[0].file);
            //当文件上传成功后在客户端预览
            $('#prev').attr('src',res[0].file).show();
        }
    })
})

//添加文章功能
$('#pAdd').on('click',function(){
    $.ajax({
        type:'post',
        url:'/posts',
        data:$('#pForm').serialize(),
        success:function(res){
            //跳转到展示文章的页面
            location.href = '/admin/posts.html';
        },
        error:function(err) {
            console.log(err);
        }
    })
})