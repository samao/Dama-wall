import { log, error } from '../utils/log';

getRemoteTemplate('welcome',{message:'欢迎登陆后台管理'})

$('.nav-item').click(function(){
    const tempName = $(this).attr('data');
    tempName && getRemoteTemplate(tempName, {message:`远程模板: ${tempName}`})
})

function getRemoteTemplate(url: string, data?: any): void {
    const template = `/template/${url}`;
    $.get(template).done(text => {
        $('.content').html(text);
    })
}