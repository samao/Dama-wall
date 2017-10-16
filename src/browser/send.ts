import * as $ from 'jquery';
$(() => {
    let input = $('input[type="text"]');

    $('#sendBtn').click(function(){
        $.post(location.href, {message:input.val()},(data) => {
            data = JSON.parse(data);
            if(data.ok) 
                $('#info').html('发送成功:'+ data.message);
            else
                $('#info').html(data.reason);
            $('#info').fadeIn().fadeOut(3000);
        })
        input.val('');
    })

    let hiden: boolean = true;
    const emoj = $('.emojPanel');

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