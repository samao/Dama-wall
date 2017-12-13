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