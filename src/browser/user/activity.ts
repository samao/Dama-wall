/*
 * @Author: iDzeir 
 * @Date: 2017-12-19 12:27:45 
 * @Last Modified by:   iDzeir 
 * @Last Modified time: 2017-12-19 12:27:45 
 */

import * as $ from 'jquery';
import htmlParser from '../utils/htmlParser';

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
        data.forEach(({rid,title,description}) => {
            const url = `http://dama.cn:3000/danmu/${rid}`;
            const qr = `http://dama.cn:3000/qr/${rid}`;
            html += '<tr>';
            html += `<td>${htmlParser(rid)}</td>`;
            html += `<td>${htmlParser(title)}</td>`;
            html += `<td>${htmlParser(description)}</td>`;
            html += `<td><a href="${url}" target="_blank">${htmlParser(url)}</a></td>`
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