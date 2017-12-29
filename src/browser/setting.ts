/*
 * @Author: iDzeir 
 * @Date: 2017-12-19 12:28:33 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2017-12-29 17:35:39
 */

import * as $ from 'jquery';
import { log, error } from "../utils/log";
import { loadPug } from './utils/pugUtil';
import * as React from 'react';

$(() => {
    const container = $('.wraper');
    $('.nav li a').click(function() {
        const url = $(this).attr('data');
        if(url)
            loadPug(container, url);
    })
})