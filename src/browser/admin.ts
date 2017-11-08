/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 10:26:55 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2017-11-08 14:21:27
 */

import * as $ from 'jquery';
import { log, error } from '../utils/log';
import { loadPug } from './utils/pugUtil';

const container = $('.content');

loadPug(container, 'welcome',{message:'欢迎登陆后台管理'})

$('.nav-item').click(function(){
    const tempName = $(this).attr('data');
    tempName && loadPug(container, tempName, {message:`远程模板: ${tempName}`})
})