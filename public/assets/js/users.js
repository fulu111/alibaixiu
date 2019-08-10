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

//删除单个用户功能
$('tbody').on('click','.del',function(){
    //先弹出一个确认框  不可逆的操作
    if(window.confirm('真的要删除么？')) {
        let id = $(this).parent().attr('data-id');
        // console.log(id);
        //发送ajax
        $.ajax({
            type:'delete',
            url:'/users/'+id,
            success:function(res) {
                let index = userArr.findIndex(item=>item._id==res._id);
                userArr.splice(index,1);
                render(userArr);
            }
        })
    }
})

//全选反选  实现全选功能
$('thead input').on('click',function(){
    //先获取复选框的checked属性
    let flag = $(this).prop('checked');
    //设置下面的复选框  下面复选框的checked属性值就是由flag变量的值来决定的
    $('tbody input').prop('checked',flag);
    // 如果上面的全选框被打勾  就显示批量删除按钮
    if(flag) {
        $('.btn-sm').show();
    } else {
        $('.btn-sm').hide();
    }
});
//给下面的复选框注册点击事件
$('tbody').on('click','input',function(){
    // 如果下面的复选框选中的个数 等于它下面复选框的个数 就表示所有的都选中了 上面那个复选框 就要打勾 反之只要有一个没有选中 那么上面的那个复选框 就不打勾
    if($('tbody input').length == $('tbody input:checked').length) {
        $('thead input').prop('checked',true);
    }else {
        $('thead input').prop('checked',false);
    }
    //如果下面的复选框 选中的个数大于1 显示批量删除按钮 否则就隐藏
    if ($('tbody input:checked').length>1) {
        $('.btn-sm').show();
    }else {
        $('.btn-sm').hide();
    }
});

//给批量删除按钮注册点击事件
$('.btn-sm').on('click',function(){
    if(window.confirm('真的要删除么？')) {
        let ids = [];
        //获取被选中的元素id值
        let checkUser = $('tbody input:checked');
        //对checkUser进行遍历
        checkUser.each(function (k,v) {
            let id = v.parentNode.parentNode.children[6].getAttribute('data-id');
            ids.push(id);
        });

        //发送ajax
        $.ajax({
            type:'delete',
            url:'/users/'+ids.join('-'),
            success:function (res) {
            // res是这一个数组 数组里面放的被删除的元素 元素是一个对象 
                res.forEach(e=>{
                    let index = userArr.findIndex(item=>item._id == e._id);
                    userArr.splice(index,1);
                    render(userArr);
                })
            }
        })
    }
});

