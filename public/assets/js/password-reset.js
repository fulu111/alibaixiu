/* $('#modifyForm').on('submit',function(){
    let formData = $(this).serialize();
    $.ajax({
        type:'put',
        url:'/users/password',
        data:formData,
        success:function() {
            location.href='/admin/login.html';
        }
    })
    return false;
}) */
$('#passModify').on('click',function(){
    /* if($('#old').val().trim().length==0 || $('#password').val().trim().length==0 || $('#confirm').val().trim().length==0) {
        $('.alert').fadeIn(1000).delay(1000).fadeOut(1000);
        $('#msg').text('存在密码未输入，请确认后再提交');
    } */
    // let password = $('#password').val();
    let passwordReg = /\w{4,16}/;
    if(!passwordReg.test($('#password').val())) {
        $('.alert').fadeIn(1000).delay(1000).fadeOut(1000);
        $('#msg').text('新密码不合法，请重新输入');
        return;
    }
    if($('#old').val()==$('#password').val()) {
        $('.alert').fadeIn(1000).delay(1000).fadeOut(1000);
        $('#msg').text('与原密码一样，请重新输入');
        return;
    }
    if($('#password').val()!==$('#confirm').val()) {
        $('.alert').fadeIn(1000).delay(1000).fadeOut(1000);
        $('#msg').text('新密码不一致，请重新输入');
        return;
    }
    $.ajax({
        type:'put',
        url:'/users/password',
        data:$('#modifyForm').serialize(),
        success:function(res){
            location.href='/admin/login.html';
        },
        error:function(res) {
            $('.alert').fadeIn(1000).delay(1000).fadeOut(1000);
            $('#msg').text('密码错误');
          }
    })
})