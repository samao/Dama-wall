import * as $ from 'jquery';
import { log, error } from '../../utils/log';
import { loadPug } from '../utils/pugUtil';
import { SuccessType, FailType, isSuccessType } from "../../utils/feedback";

$(() => {
    const container = $('.wraper');
    function backward():void {
        loadPug(container, 'user_act');
    }
    $('#submit').click(e => {
        e.preventDefault();
        $.post(`http://dama.cn:3000/api/activity/${$('#aid').val()}`, {
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
    });

    $('#cancel').click(e => {
        e.preventDefault();
        backward();
    })
    log('用户创建活动');
})