import * as $ from 'jquery';
$(() => {
    $('#sendBtn').click(function(){
        let input = $('input[type="text"]');
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
})