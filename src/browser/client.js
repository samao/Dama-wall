// websocket 长连接
(function(){
    let heartId,onlineId;
    let ws = new WebSocket('ws://localhost:8080/jiafeiyan');
    ws.onopen = function(){
    }
    ws.onclose = function(code,err){
        console.log('close',code,err);
        clearInterval(onlineId);
        clearInterval(heartId);
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
                    onlineId = setInterval(() => {
                        ws.send(JSON.stringify({action:'online',data:{}}));
                    },10000);
                    heartId = setInterval(() => {
                        ws.send(JSON.stringify({action:'heart',data:{}}))
                    },5000)
                    ws.send(JSON.stringify({action:'post',data:'发送猴王了操你妈一条acfun聊政治风波fen信息'}))
                break;
                case 202:
                    console.log('当前房间用户数',data.data)
                break;
                case 203:
                    ws.send(JSON.stringify({action:'entry',data:{id:'admin',name:'wangerxiao',age:18}}));
                break;
            }
        }
    }
})()

//http 发送弹幕
(function(){
    $.post('http://localhost:3000/danmu/jiafeiyan',{message:'又说那话',color:'0xFF0000'}, data => {
        if(data.ok) 
            console.log('发送成功:'+ data.data)
        else
            console.log(data.reason);
    })
})()

//发送参照 views/danmu.pug