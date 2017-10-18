import * as $ from 'jquery';
import { log, error } from "../utils/Log";

//请求成功类型别名
type SuccessType = {ok: true, data: any};
//请求失败类型别名
type FailType = {ok: false, reason: string};

/**
 * 判断是否请求成功
 * @param data 接口返回数据
 */
function isSuccessType(data: SuccessType | FailType): data is SuccessType {
    return (<FailType>data).reason === undefined && data.ok;
}

$(() => {
    $('#registerBtn').click(function(){
        let username = $('input[name="username"]').val();
        let pwd = $('input[name="pwd"]').val();
        let confirm = $('input[name="confirmPwd"]').val();

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
            pwd
        }, (data: SuccessType | FailType) => {
            log(JSON.stringify(data));
            if(isSuccessType(data)) {
                $('.group').hide();
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