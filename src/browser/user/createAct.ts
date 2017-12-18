import * as $ from 'jquery';

import { hasTag } from '../utils/htmlParser';
import { log, error } from '../../utils/log';
import { loadPug } from '../utils/pugUtil';
import { SuccessType, FailType, isSuccessType } from "../../utils/feedback";

$(() => {
    const container = $('.wraper');
    //返回上个页面
    function backward():void {
        loadPug(container, 'user_act');
    }
    /** 判断id是否为字符串 */
    function is(id: string|number|string[]|undefined): id is string {
        return typeof id === 'string';
    }

    $('#submit').click(e => {
        e.preventDefault();

        const aid = $('#aid').val();

        if(is(aid) && !hasTag(aid)) {

            $.post(`http://dama.cn:3000/api/activity/${aid}`, {
                title: $('#atitle').val(),
                description: $('#adescription').val()
            }, (data: SuccessType|FailType) => {
                if(isSuccessType(data)) {
                    log('创建成功');
                    backward();
                }else {
                    error(`创建活动错误：${data.reason}`)
                }
            });
        }else{
            error(`输入内容包含敏感字符`)
        }
    });

    $('#cancel').click(e => {
        e.preventDefault();
        backward();
    })
    log('用户创建活动');
})