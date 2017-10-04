import * as $ from 'jquery';
$(() => {
    $('#registerBtn').click(function(){
        $.post('/register',{
            username:$('input[name="username"]').val(),
            pwd:$('input[name="pwd"]').val()
        }, data => {
            console.log(data)
            if(data.ok) {
                $('#register').html('注册成功, 3秒后跳转');
                setTimeout(function(){
                    location.href = '/'
                }, 3000)
            }else{
                console.log(data.result)
            }
        })
    })
})