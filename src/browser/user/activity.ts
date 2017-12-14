import * as $ from 'jquery';
import { log, error } from '../../utils/log';
import { loadPug } from '../utils/pugUtil';
import { SuccessType, FailType, isSuccessType } from "../../utils/feedback";

interface IActData {
    rid: string;
    title: string;
    description: string;
}

$(() => {
    const container = $('.wraper');
    const actBody = $('#actBody');
    
    async function getActis() {
        return await $.post('http://dama.cn:3000/api/activities')
    }

    function buildTable(data: IActData[]):void {
        log('构建表格');
        actBody.children().remove();
        var html = '';
        data.forEach(tr => {
            const url = `http://dama.cn:3000/danmu/${tr.rid}`;
            const qr = `http://dama.cn:3000/qr/${tr.rid}`;
            html += '<tr>';
            html += `<td>${tr.rid}</td>`;
            html += `<td>${tr.title}</td>`;
            html += `<td>${tr.description}</td>`;
            html += `<td><a href="${url}" target="_blank">${url}</a></td>`
            html += `<td><a href="${qr}" target="_blank"><image src="${qr}"></a></td>`
            html += `<td><button class="btn btn-primary btn-xs">修改</button></td>`;
            html += '</tr>'
        });
        actBody.html(html);
    }

    $('#create').click(() => {
        loadPug(container, 'user_create_act');
    })

    getActis().then((data:SuccessType|FailType) => {
        if(isSuccessType(data)) {
            buildTable(data.data)
        }else{
            error(`获取活动数据失败 ${data.reason}`);
        }
    })
})