import * as $ from 'jquery';
import { log, error } from "../utils/log";

$(() => {
    //最多输入字个数
    const MAX_INPUT = 30;
    //表情面板状态
    let hiden: boolean = true;

    const input = $('input[type="text"]');
    const remain = $('.speak cite');
    const emoj = $('.emojPanel');
    const info = $('#info');

    function reset(): void {
        input.val('');
        remain.text(MAX_INPUT);
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
            $.post(location.href, {message:input.val()},(data) => {
                data = JSON.parse(data);
                if(data.ok) 
                    info.text('发送成功:'+ data.message);
                else
                    info.text(data.reason);
                info.fadeIn().fadeOut(3000);
            })
            reset();
        }else{
            info.text('发送内容不能为空');
            reset();
        }
    })

    $('.face-toggle').click(() => {
        if(hiden) {
            emoj.show();
        }else{
            emoj.hide();
        }
        hiden = !hiden;
    });

    $('.emojPanel li').click(function() {
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
        }
    })
})