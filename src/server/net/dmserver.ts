import * as http from 'http';
import * as url from 'url';
import * as cluster from 'cluster';

import {log} from 'util';

import * as WebSocket from 'ws';
import { WebSocketEvent } from './events';
import { WebSocketStatus } from "./status";
import { connections } from "./connectionsPool";

class DanmuServer {

    private _wss: WebSocket.Server;

    constructor(options:{
        host?: string,
        port?: number,
        server?: http.Server
    }){
        
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
        this._wss.on(WebSocketEvent.CONNECTION,this.entry)
            .once(WebSocketEvent.LISTENING,() => {
                log(`websocket 服务运行在：${port}`)
            })
    }

    private entry(ws: WebSocket, req: http.IncomingMessage): void {
        this.vaild(req.url).then((pathname) => {
            //log(`路径验证成功：${req.url}`);
            //监听下个用户登录包
            ws.once(WebSocketEvent.MESSAGE,(data:WebSocket.Data) => {
                clearTimeout(delayid);
                let info:{id: string};
                try{
                    info = JSON.parse(data.toString());
                    log(data.toString())
                    //检查用户身份
                }catch(e){
                    ws.close(WebSocketStatus.ERROR,'用户认证消息参数错误');
                    return;
                }
                log('收到用户登陆 >' + process.pid);
                this.setAuthUser(info.id, ws, pathname);
            })
            let delayid = setTimeout(() => ws.close(),30000);
        },(reason) => {
            log(`不存在的连接路径: ${reason}`)
            ws.close(WebSocketStatus.ILLEGAL,reason);
        }).catch(() => {
            ws.close(WebSocketStatus.ERROR,'无法验证访问路径');
        })
    }

    /**
     * 返回 ts Promise<any>
     * @param path 用户连接的ws路径
     */
    private vaild(path: string|undefined): Promise<string>{
        return new Promise((res,rej) => {
            if(typeof path === 'undefined'|| typeof path === 'string' && path.replace(/\//,'') === '') {
                setImmediate(rej,'please check your path');
                return;
            }
            let {pathname} = url.parse(path);
            if(pathname) {
                //检查路径
                setImmediate(res,pathname)
            }else{
                setImmediate(rej,'illegal path!!!')
            }
        })
    }

    private setAuthUser(id: string,ws: WebSocket,pathname: string): void {
        //通知主线程用户在那个房间，那个线程
        cluster.worker.send({
            action:'entry',
            data:{
                pathname,
                uid:id
            }
        })
        ws.on(WebSocketEvent.MESSAGE,data => {
            log('用户心跳');
        });
        ws.on(WebSocketEvent.ERROR,err => {});
        //客户端关闭
        ws.on(WebSocketEvent.CLOSE,(code,message) => {
            ws.removeAllListeners();
            connections.remove(id);

            //通知主线程连接关闭
            cluster.worker.send({
                action:'leave',
                data:{
                    pathname,
                    uid:id,
                }
            })
        })
        connections.add(id,ws,pathname);
        ws.send(JSON.stringify({action:'auth',command:{level:15,admin:true,total:connections.size}}));
    }
}

export {DanmuServer};