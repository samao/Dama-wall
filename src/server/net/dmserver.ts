import * as WebSocket from 'ws';
import * as http from 'http';
import * as Event from 'events';
import * as url from 'url';

import {log} from 'util';

class DanmuServer extends Event {

    private _wss: WebSocket.Server;

    private _userMap: Map<string,any>;

    constructor(options:{
        host?: string,
        port?: number,
        server?: http.Server
    }){
        super();
        this._userMap = new Map<string,any>();
        this.createWs(options.port,options.host,options.server);
    }

    private createWs(port?: number,host?: string|undefined, server?: http.Server|undefined): void {
        this._wss = new WebSocket.Server({
            host,
            port,
            server
        });
        this._userMap.clear();
        this._wss.on(DMEvent.CONNECTION,this.entry);
    }

    private entry(ws: WebSocket, req: http.IncomingMessage): void {
        //log(`客户端连接成功 ${req}`);
        console.dir(req,{depth:2});
        setTimeout(() => ws.close(),4000);
    }
}
enum DMEvent{
    CONNECTION = 'connection'
}
export {DanmuServer};