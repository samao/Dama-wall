import * as $ from 'jquery';
import { log, error } from "../../utils/log";
import { SuccessType, FailType, isSuccessType } from "../../utils/feedback";

$('.modify-btn').click(function(){
    const pNode = $(this).parent();
    const checked =  pNode.siblings('td').find('.isAdmin').prop('checked');
    const uid = pNode.siblings('.uid').text();
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