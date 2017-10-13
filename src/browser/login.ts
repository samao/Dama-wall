import * as $ from 'jquery';
import { log, error } from "../utils/log";

$(() => {
    $('#registerBtn').click(function(){
        let username = $('input[name="username"]').val();
        let pwd = $('input[name="pwd"]').val();

        if(typeof username !== 'string' || typeof pwd !== 'string') return;

        if(username.trim().length < 4) {
            error('用户名不能少于4个字符')
            return;
        }
        if(pwd.trim().length < 5) {
            error('密码太简单了')
            return;
        }

        $.post('/login',{
            username,
            pwd
        }, data => {
            console.log(data)
            let responseTxt = $('.register-warp .reg-box .info');
            if(data.ok) {
                $('.group').fadeOut();
                responseTxt.html('登录成功, 3秒后跳转');
                setTimeout(function(){
                    location.href = '/'
                }, 3000)
            }else{
                console.log(data.reason)
                responseTxt.html(data.reason);
            }
        })
    })
})