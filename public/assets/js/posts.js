//发送ajax将服务器的数据渲染到模板上面
$.ajax({
    type:'get',
    url:'/posts',
    success:function(res){
        // console.log(res);
        let html = template('pTpl',res);
        $('tbody').html(html);
    }
})

function formateDate(date) {
    //将日期时间字符串转换成日期对象
    date = new Date(date);
    return date.getFullYear()+'-'+(date.getMonth()+1).toString().padStart(2,0)+'-'+date.getDate();
}