import { log, error } from '../utils/log';
import * as dot from 'dot';

renderTemplete('welcome',{message:'欢迎登陆后台管理'})

$('.nav-item').click(function(){
    const template = $(this).attr('data');
    template && renderTemplete(template, {message:`远程模板: ${template}`})
})

function renderTemplete(url: string, data?: any): void {
    const template = `/template/${url}`;
    $.get(template).done((text) => {
        const warpper = dot.compile(text)(data);
        $('.content').html(warpper);
    })
}