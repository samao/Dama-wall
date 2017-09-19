import * as WebSocket from 'ws';
import * as http from 'http';
import * as Event from 'events';
import * as url from 'url';

import {log} from 'util';

class DanmuServer extends Event {

    private _wss: WebSocket.Server;

    constructor(options:{
        host?: string,
        port?: number,
        server?: http.Server
    }){
        super();
        
        this.entry = this.entry.bind(this);
        this.setAuthUser = this.setAuthUser.bind(this);

        this.createWs(options.port,options.host,options.server);
    }

    private createWs(port?: number,host?: string|undefined, server?: http.Server|undefined): void {
        this._wss = new WebSocket.Server({
            host,
            port,
            server
        });
        this._wss.clients = new Set<WebSocket>();
        this._wss.on(DMEvent.CONNECTION,this.entry);
    }

    private entry(ws: WebSocket, req: any): void {
        console.log('_SELF:',this instanceof DanmuServer);
        //连上之后需要客户端登陆，然后绑定ws和用户信息uid
        ws.once(DMEvent.MESSAGE,(data:WebSocket.Data) => {
            clearTimeout(delayid);
            try{
                let info = JSON.parse(data.toString());
                log(data.toString())
                //检查用户身份
            }catch(e){
                ws.close();
                return;
            }
            log('收到用户登陆');
            this.setAuthUser(ws);
        })
        let delayid = setTimeout(() => ws.close(),30000);
    }

    private setAuthUser(ws: WebSocket): void {
        ws.on(DMEvent.MESSAGE,data => {});
        ws.on(DMEvent.ERROR,err => {});
        ws.on(DMEvent.CLOSE,(code,message) => {})
        this._wss.clients.add(ws);

        ws.send(JSON.stringify({action:'auth',command:{level:15,admin:true}}));
    }
}
enum DMEvent{
    CONNECTION = 'connection',
    MESSAGE = 'message',
    ERROR = 'error',
    CLOSE = 'close'
}
export {DanmuServer};