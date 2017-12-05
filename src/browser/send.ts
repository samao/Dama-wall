/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 10:27:36 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2017-12-05 12:04:01
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
    let settingHiden: boolean = true;

    const input = $('input[type="text"]');
    const remain = $('.speak cite');
    const emoj = $('.emojPanel');
    const settingPanel = $('.setting-panel');
    const info = $('#info');

    let color = localStorage.getItem(Storages.DanmuColor)||'FFFFFF';

    function saveColor(value:string):void{
        log(`保存弹幕颜色：${value}`);
        color = value;
        localStorage.setItem(Storages.DanmuColor,value);
    }

    function applyStorage():void {
        settingPanel.find(`li[data="#${color.toLocaleLowerCase()}"]`).find('input').attr('checked','checked')
    }

    function hidenPop():void {
        settingPanel.hide();
        emoj.hide();
        hiden = settingHiden = true;
    }

    function reset(): void {
        input.val('');
        remain.text(MAX_INPUT);
        hidenPop();
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

    applyStorage()

    input.on('input', () => {
        let putStr = input.val();
        if(typeof putStr === 'string') {
            let left = MAX_INPUT - putStr.length;
            remain.text(left);
        }
    }).focus(() => hidenPop());

    $('#sendBtn').click(() => {
        let putStr = input.val();
        if(typeof putStr === 'string' && putStr.trim().length !== 0) {
            //log(`发送弹幕：${input.val()}<${color}>`);
            $.post(location.href, {
                message:input.val(),
                color:`0x${color}`
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
        settingPanel.hide();
        settingHiden = true;
        hiden = !hiden;
    });

    $('.font').click(() => {
        if(settingHiden) {
            settingPanel.show();
        }else {
            settingPanel.hide();
        }
        emoj.hide();
        hiden = true;
        settingHiden = !settingHiden;
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

    $('.setting-panel li').click(function() {
        const rgb = $(this).find('span').css('background-color').match(/\d+/ig);
        if(rgb) {
            const rgbNum = rgb.map(e => Number(e));
            const hex = ((rgbNum[0] << 16) | (rgbNum[1] << 8) | rgbNum[2]).toString(16);
            saveColor(`${padStart(hex,6)}`);
        }
    })
})