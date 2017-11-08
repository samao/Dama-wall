/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 10:27:22 
 * @Last Modified by:   iDzeir 
 * @Last Modified time: 2017-11-08 10:27:22 
 */

import * as $ from 'jquery';
import { log, error } from "../utils/log";
import { SuccessType, FailType, isSuccessType } from "../utils/feedback";

$(() => {
    $('#registerBtn').click(function(e){
        e.preventDefault();

        let username = $('#username').val();
        let pwd = $('#pwd').val();
        let confirm = $('#confirmPwd').val();
        let mail = $('#mail').val();
        let tel = $('#tel').val();
        log(username,pwd,confirm,mail,tel);
        const infoTxt = $('.info');

        if(typeof username !== 'string' || typeof pwd !== 'string' || typeof confirm !== 'string') return;

        if(username.trim().length < 4) {
            error('用户名不能少于4个字符')
            return;
        }
        if(pwd.trim().length < 5) {
            error('密码太简单了')
            return;
        }
        if(pwd.trim() !== confirm.trim()) {
            error('两次输入的密码不一致')
            return;
        }

        $.post('/register',{
            username,
            pwd,
            tel,
            mail
        }, (data: SuccessType | FailType) => {
            log(JSON.stringify(data));
            if(isSuccessType(data)) {
                $('.register-body form').hide();
                infoTxt.text('注册成功, 3秒后跳转');
                setTimeout(function(){
                    location.href = '/'
                }, 3000)
            }else{
                log(data.reason)
                infoTxt.text(data.reason);
            }
        })
    })
})