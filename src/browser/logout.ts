/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 10:27:15 
 * @Last Modified by:   iDzeir 
 * @Last Modified time: 2017-11-08 10:27:15 
 */

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