var ws = new WebSocket('ws://localhost:8080');
ws.onopen = function(){
    console.log('open');
    ws.send(JSON.stringify({id:'9527',name:'wangerxiao',age:18}));

    setInterval(() => {
        //ws.send(JSON.stringify({}));
    },5000)
}
ws.onclose = function(code,err){
    console.log('close',code,err)
}
ws.onmessage = function(data) {
    console.log(data);
}