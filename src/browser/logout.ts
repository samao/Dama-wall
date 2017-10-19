import * as $ from "jquery";
import { log, error } from "../utils/log";

$('.logout').click(function(){
    log('用户登出');
    $.post('/logout', function(){
        log('登出成功');
        setTimeout(function(){
            location.reload();
        }, 1000);
    })
})