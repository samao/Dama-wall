import * as $ from 'jquery';
import { log, error } from "../utils/log";
import { parse } from 'querystring';
import { SuccessType, FailType, isSuccessType } from "../utils/feedback";

$(() => {
    $('#loginBtn').click(function(e){
        e.preventDefault();

        let username = $('#username').val();
        let pwd = $('#pwd').val();

        if(typeof username !== 'string' || typeof pwd !== 'string') return;

        $.post('/login',{
            username,
            pwd
        }, (data: SuccessType|FailType) => {
            let responseTxt = $('.info');
            log(JSON.stringify(data));
            if(isSuccessType(data)) {
                $('.register-body form').fadeOut();
                responseTxt.html('登录成功, 3秒后跳转');
                const {'?return':returnUrl = '/'} = parse(location.search);
                setTimeout(function(){
                    location.href = returnUrl;
                }, 3000)
            }else{
                responseTxt.html(data.reason);
            }
        })
    })
})