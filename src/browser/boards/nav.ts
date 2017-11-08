import { log, error } from '../../utils/log';
import * as $ from 'jquery';

$('.activeBtn').click(function(){
    const NAV_ID = $(this).attr('data');
    const checked = $(this).prop('checked')
    $.ajax({
        url:`/api/nav`,
        type:'patch',
        data:{
            id:NAV_ID,
            checked
        }
    }).done(data => {
        log('更新nav成功')
    }).fail(reason => {
        error('ERROR:',reason)
    })
})