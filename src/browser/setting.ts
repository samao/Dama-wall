/*
 * @Author: iDzeir 
 * @Date: 2017-12-19 12:28:33 
 * @Last Modified by:   iDzeir 
 * @Last Modified time: 2017-12-19 12:28:33 
 */

import * as $ from 'jquery';
import { log, error } from "../utils/log";
import { loadPug } from './utils/pugUtil';

$(() => {
    const container = $('.wraper');
    $('.nav li a').click(function() {
        const url = $(this).attr('data');
        if(url)
            loadPug(container, url);
    })
})