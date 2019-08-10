//建一个专门存放分类的数组
let cArr = new Array();
$('#cAdd').on('click',function(){
    $.ajax({
        type:'post',
        url:'/categories',
        data:$('#cForm').serialize(),
        success:function(res){
            cArr.push(res);
            render(cArr);
            $('#title').val('');
            $('#className').val('');
        }
    })
});

//展示分类
$.ajax({
    url:'/categories',
    type:'get',
    success:function(res) {
        cArr = res;
        render(cArr);
    }
})

//调用template方法
function render(res) {
    let str=template('cTpl',{list:res});
    $('tbody').html(str);
}

//编辑功能
var cId;
$('tbody').on('click','.edit',function(){
    cId = $(this).parent().attr('data-id');
    $('#cForm > h2').text('修改分类');
    let title = $(this).parents('tr').children().eq(1).text();
    let className = $(this).parents('tr').children().eq(2).text();
    $('#title').val(title);
    $('#className').val(className);
    $('#cAdd').hide();
    $('#cEdit').show();
});
$('#cEdit').on('click',function(){
    $.ajax({
        url:'/categories/'+cId,
        type:'put',
        data:$('#cForm').serialize(),
        success:function(res){
            let index = cArr.findIndex(item=>item._id==cId);
            cArr[index]=res;
            render(cArr);
            $('#title').val('');
            $('#className').val('');
            $('#cAdd').show();
            $('#cEdit').hide();
        }
    })
});

//删除单个
$('tbody').on('click','.del',function(){
    // 先弹出删除确认框
    if(window.confirm('确定要删除么？')) {
        let id = $(this).parent().attr('data-id');
        //发送ajax
        $.ajax({
            url:'/categories/'+id,
            type:'delete',
            success:function(res){
                let index = cArr.findIndex(item=>item._id==res._id);
                cArr.splice(index,1);
                render(cArr);
            }
        })
    }
})

//全选反选  实现全选功能
$('thead input').on('click',function(){
    //先获取复选框的checked属性
    let flag = $(this).prop('checked');
    $('tbody input').prop('checked',flag);
    if(flag) {
        $('.btn-sm').show();
    } else {
        $('.btn-sm').hide();
    }
});
//给下面的复选框注册点击事件
$('tbody').on('click','input',function(){
    // 如果下面的复选框选中的个数 等于它下面复选框的个数 就表示所有的都选中了 上面那个复选框 就要打勾 反之只要有一个没有选中 那么上面的那个复选框 就不打勾
    if($('tbody input').length==$('tbody input:checked').length) {
        $('thead input').prop('checked',true);
    } else {
        $('thead input').prop('checked',false);
    }
    if($('tbody input:checked').length>1){
        $('.btn-sm').show();
    } else {
        $('.btn-sm').hide();
    }
});
//给批量删除注册点击事件
$('.btn-sm').on('click',function(){
    if(window.confirm('确定要删除么？')){
        let cids=[];
        //获取被选中的元素id值
        let checkedCate = $('tbody input:checked');
        //对checkedCate进行遍历
        checkedCate.each(function (k,v){
            let id=v.parentNode.parentNode.children[3].getAttribute('data-id');
            cids.push(id);
        });

        //发送ajax
        $.ajax({
            url:'/categories/'+cids.join('-'),
            type:'delete',
            success:function(res) {
                //res是这一个数组 数组里面放的被删除的元素 元素是一个对象 
                res.forEach(e=>{
                    let index = cArr.findIndex(item=>item._id==e._id);
                    cArr.splice(index,1);
                    render(cArr);
                })
            }
        })
    }
})
