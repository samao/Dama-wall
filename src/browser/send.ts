/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 10:27:36 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2017-12-04 19:32:17
 */

import * as $ from 'jquery';
import { log, error } from "../utils/log";
import { SuccessType, FailType, isSuccessType } from "../utils/feedback";
import { Storages } from './storage';

$(() => {
    //最多输入字个数
    const MAX_INPUT = 30;
    //表情面板状态
    let hiden: boolean = true;
    let fontHiden: boolean = true;

    const input = $('input[type="text"]');
    const remain = $('.speak cite');
    const emoj = $('.emojPanel');
    const font = $('.fontPanel');
    const info = $('#info');

    let color = localStorage.getItem(Storages.DanmuColor)||'0xFFFFFF';

    function saveColor(value:string):void{
        color = value;
        localStorage.setItem(Storages.DanmuColor,value);
    }

    function reset(): void {
        input.val('');
        remain.text(MAX_INPUT);
        font.hide();
        emoj.hide();
        hiden = fontHiden = true;
    }

    function tips(msg: string): void {
        log(msg)
        info.text(msg);
        info.fadeIn().fadeOut(2000);
    }

    function padStart(source:string, length: number): string {
        if(source.length < length) {
            return '0'.repeat(length - source.length) + source;
        }
        return source.substr(0,length);
    }

    input.on('input', () => {
        let putStr = input.val();
        if(typeof putStr === 'string') {
            let left = MAX_INPUT - putStr.length;
            remain.text(left);
        }
    })

    $('#sendBtn').click(() => {
        let putStr = input.val();
        if(typeof putStr === 'string' && putStr.trim().length !== 0) {
            log(`发送弹幕：${input.val()}<${color}>`);
            $.post(location.href, {
                message:input.val(),
                color
            },(data: SuccessType|FailType) => {
                log(JSON.stringify(data));
                if(isSuccessType(data)) 
                    tips('发送成功:'+ data.data.message);
                else
                    tips(data.reason);
            })
            reset();
        }else{
            tips('发送内容不能为空');
            reset();
        }
    })

    $('.face-toggle').click(() => {
        if(hiden) {
            emoj.show();
        }else{
            emoj.hide();
        }
        font.hide();
        fontHiden = true;
        hiden = !hiden;
    });

    $('.font').click(() => {
        log(fontHiden);
        if(fontHiden) {
            font.show();
        }else {
            font.hide();
        }
        emoj.hide();
        hiden = true;
        fontHiden = !fontHiden;
    })

    $('.emojPanel li').click(function() {
        hiden = true;
        emoj.hide();
        const msg = input.val();
        if(typeof msg === 'string') {
            let tag = $(this).attr('data-tag')||'';
            const dom: any = input.get(0);
            const begin: number = dom.selectionStart;
            const end: number = dom.selectionEnd;
            let olds = msg.split('');
            olds.splice(begin, end - begin,tag);
            input.val(olds.join(''));
            input.trigger('input');
        }
    })

    $('.fontPanel li').click(function() {
        const rgb = $(this).css('background-color').match(/\d+/ig);
        if(rgb) {
            const rgbNum = rgb.map(e => Number(e));
            const hex = ((rgbNum[0] << 16) | (rgbNum[1] << 8) | rgbNum[2]).toString(16);
            saveColor(`0x${padStart(hex,6)}`);
        }
    })
})