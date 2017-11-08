/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 10:26:02 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2017-11-08 16:16:06
 */

import * as $ from 'jquery';
import { log, error } from "../../utils/log";
import { SuccessType, FailType, isSuccessType } from "../../utils/feedback";


function getUid(node: HTMLElement): string {
    return $(node).attr('data')||'';
}

function getParent(node: any): any {
    return $(node).parent()
}

$('.modify-btn').click(function(){
    const pNode = $(this).parent();
    const checked =  pNode.siblings('td').find('.isAdmin').prop('checked');
    const uid = getUid(this);
    $.post(`/api/user/${uid}`,{
        checked
    }).done((data: SuccessType | FailType) => {
        if(isSuccessType(data)) {
            log('改变权限成功',data.data)
        }else{
            log(`改变权限失败 ${data.reason}`)
        }
    })
})
$('.delete-btn').click(function(){
    const uid = getUid(this);
    $.ajax(`/api/user/${uid}`,{
        type:'delete'
    }).done((data: SuccessType|FailType) => {
        if(isSuccessType(data)){
            log('删除成功', data.data);
            $(this).parents('tr').fadeOut(() => {
                $(this).parents('tr').remove();
            });
        }else{
            log(`删除失败 ${data.reason}`);
        }
    });
})