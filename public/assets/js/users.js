//主要用于操作用户
let userArr = new Array();


//将用户列表展示出来
$.ajax({
    type:'get',
    url:'/users',
    success:function(res){
        // console.log(res);
        userArr = res;
        render(userArr);
    }
})

//用于调用template方法
function render(arr){

    let str = template('userTpl',{list:arr});
    $('tbody').html(str);
}

//添加用户功能
$('#userAdd').on('click',function(){
    $.ajax({
        type:'post',
        url:'/users',
        data:$('#userForm').serialize(),
        success:function(res){
            userArr.push(res);
            render(userArr);
        }
    })
})

$('#avatar').on('change',function(){
    let formData = new FormData();
    formData.append('avatar',this.files[0]);
    $.ajax({
        type:'post',
        url:'/upload',
        data:formData,
        //让$.ajax不要解析请求参数
        processData:false,
        //让$.ajax不要设置请求参数的类型
        contentType:false,
        success:function(res) {
            //实现头像预览功能
            $('#preview').attr('src',res[0].avatar);
            $('#hiddenAvatar').val(res[0].avatar);
            render(userArr);
        }
    })
})


var userId;
//编辑用户功能
$('tbody').on('click','.edit',function(){
    //保存当前被修改的这个用户的id
    userId = $(this).parent().attr('data-id');

    $('#userForm>h2').text('修改用户');
    //先获取当前被点击这个元素的祖先 tr
    let trObj = $(this).parents('tr');
    //获取图片的地址
    let imgSrc = trObj.children(1).children('img').attr('src');
    //将图片地址写入隐藏域
    $('#hiddenAvatar').val(imgSrc);
    //如果imgSrc有值
    if(imgSrc) {
        $('#preview').attr('src',imgSrc);
    } else {
        $('#preview').attr('src','../assets/img/default.png');
    }
    //将对应的内容写入到左边的输入框中
    $('#email').val(trObj.children().eq(2).text());
    $('#nickName').val(trObj.children().eq(3).text());
    let status = trObj.children().eq(4).text();
    if(status =='激活') {
        $('#jh').prop('checked',true);
    }else {
        $('#wjh').prop('checked',true);
    }
    let role = trObj.children().eq(5).text();
    if(role == '超级管理员') {
        $('#admin').prop('checked',true);
    } else{
        $('#normal').prop('checked',true);
    }
    $('#userAdd').hide();
    $('#userEdit').show();
});

$('#userEdit').on('click',function(){
    $.ajax({
        type:'put',
        url:'/users/'+userId,
        data:$('#userForm').serialize(),
        success:function(res){
            let index = userArr.findIndex(item=>item._id == userId);
            userArr[index] = res;
            render(userArr);

            //修改用户以后将表单数据还原
            $('#userForm>h2').text('添加新用户');
            $('#hiddenAvatar').val('');
            $('#preview').attr('src','../assets/img/default.png');
            $('#userAdd').show();
            $('#userEdit').hide();
            $('#email').val('');
            $('#nickName').val('');
            // $('.radio-inline').children().children().prop('checked',false);
            $('#admin').prop('checked',false);
            $('#normal').prop('checked',false);
            $('#jh').prop('checked',false);
            $('#wjh').prop('checked',false);
        }
    })
})