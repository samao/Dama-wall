var ws = new WebSocket('ws://localhost:3000');
ws.onopen = function(){
    console.log('open');
    ws.send(JSON.stringify({uid:9527,name:'wangerxiao',age:18}));
}
ws.onclose = function(){
    console.log('close')
}
ws.onmessage = function(data) {
    console.log(data);
}