(function(){
    var ws = new WebSocket('ws://localhost:8080/9999');
    ws.onopen = function(){
        ws.send(JSON.stringify({action:'entry',data:{id:'9527',name:'wangerxiao',age:18}}));
    }
    ws.onclose = function(code,err){
        console.log('close',code,err)
    }
    ws.onmessage = function(message) {
        console.log(message);
        let data = JSON.parse(message.data);
        console.log(data)
        if(data.action) {
            //收到别的的消息
            if(data.action === 'post') {
                console.log('用户聊天消息',data.data);
            }
        } else if(data.status) {
            //自己发送的消息反馈
            switch(data.status) {
                case 201:
                    console.log('登录成功开始发送在线数和心跳');
                    let onlineId = setInterval(() => {
                        ws.send(JSON.stringify({action:'online',data:{}}));
                    },10000);
                    let heartId = setInterval(() => {
                        ws.send(JSON.stringify({action:'heart',data:{}}))
                    },5000)
                    ws.send(JSON.stringify({action:'post',data:'隔壁有个大奶妹子'}))
                break;
                case 202:
                    console.log('当前房间用户数',data.data)
                break;
            }
        }
    }
})()