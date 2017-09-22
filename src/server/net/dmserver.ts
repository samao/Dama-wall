import * as http from 'http';
import * as url from 'url';
import * as cluster from 'cluster';
import * as WebSocket from 'ws';

import {log, error} from '../../utils/log';
import { WebSocketEvent } from './events';
import { WebSocketStatus } from "./status";
import { WorkerEvent } from '../worker/events';
import { Actions } from "../worker/actions";
import { lobby } from "../lobby/lobby";

class DanmuServer {

    private _wss: WebSocket.Server;

    private _onlineMap: Map<string,number> = new Map();

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
                log(`弹幕服务工作线程端口：${port}`,`PID: ${process.pid}`)
            })
        
        cluster.worker.on(WorkerEvent.MESSAGE, (message) => {
            //收到主线程消息
            let {action,data} = message;
            //log('工作线程执行同步：' + action);
            switch(action) {
                case Actions.ENTRY:
                    this.increase(data.pathname)
                break;
                case Actions.LEAVE:
                    this.reduce(data.pathname);
                break;
                case Actions.POST:
                    log('有人说话了：' + data);
                break;
            }
        })
    }

    private increase(rid: string): void {
        let total = this._onlineMap.get(rid) || 0;
        this._onlineMap.set(rid, ++total);
    }

    private reduce(rid: string): void {
        let total = this._onlineMap.get(rid) || 1;
        this._onlineMap.set(rid, --total);
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
                    //log(data.toString())
                    //检查用户身份
                }catch(e){
                    ws.close(undefined,'用户认证消息参数错误');
                    return;
                }
                log(`用户 ${info.id} 登录成功,当前线程 PID: ${process.pid}`);
                this.setAuthUser(info.id, ws, pathname);
            })
            let delayid = setTimeout(() => ws.close(),30000);
        },(reason) => {
            error(`不存在的连接路径: ${reason}`)
            ws.close(undefined,reason);
        }).catch((reason) => {
            error('无法验证访问路径，请检查代码:' + reason);
            ws.close(undefined,reason);
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

    private sendMaster(action: string,data:any): void {
        cluster.worker.send({action, data});
    }

    /**
     * 保存连接信息
     * @param id 用户id
     * @param ws 连接ws
     * @param pathname 连接路径
     */
    private setAuthUser(id: string,ws: WebSocket,pathname: string): void {
        //通知主线程用户在那个房间，那个线程
        this.sendMaster(Actions.ENTRY,{
                pathname,
                uid:id
            })
        ws.on(WebSocketEvent.MESSAGE,data => {
            let msg: {action: string,data:any} = JSON.parse(data.toString());
            switch(msg.action){
                case Actions.POST:
                    this.sendMaster(msg.action,msg.data);
                break;
                case Actions.ONLINE:
                    let total = this._onlineMap.get(pathname)||1;
                    send(ws, {action:Actions.ONLINE, data:total})
                break;
            }
        });
        ws.on(WebSocketEvent.ERROR,err => {});
        //客户端关闭
        ws.on(WebSocketEvent.CLOSE,(code,message) => {
            ws.removeAllListeners();
            lobby.get(pathname).remove(id,ws);
            //通知主线程连接关闭
            this.sendMaster(Actions.LEAVE,{
                    pathname,
                    uid:id,
                });
        });
        //按房间分组用户，允许用户建立多个连接
        lobby.get(pathname).add(id, ws);
        //log(`当前线程用户数：${lobby.get(pathname).size}`);
        send(ws, {action: 'auth', data: {level: 15, admin: true}})
    }
}

/**
 * 规范发送内容
 * @param ws 
 * @param data keys: action & data
 */
const send = (ws: WebSocket, data: {action: string,data: any}) => {
    ws.send(JSON.stringify(data));
}

let uuid: number = 0;
const GEN = () =>  ++uuid;

export {DanmuServer};