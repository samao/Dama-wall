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
import { checkout, restore } from "../db/pool";

class DanmuServer {
    /**
     * 心跳循环间隔时间 10s
     */
    private readonly DELAY: number = 10000;

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
            let {action, data, pathname} = message;
            //log('工作线程执行同步：' + action);
            switch(action) {
                case Actions.ENTRY:
                case Actions.LEAVE:
                    let { total } = message;
                    log('同步房间人数',total)
                    this._onlineMap.set(pathname, total);
                break;
                case Actions.POST:
                    log('同步聊天消息',JSON.stringify(message))
                    //3.其它工作线程聊天消息,同步到本线程相关用户
                    if(lobby.has(pathname))
                        lobby.get(pathname).broadcast(JSON.stringify({action, data}));
                break;
                case Actions.DESTROY:
                    this.workerDestroy(data);
                break;
            }
        });

        //心跳轮询检查
        setInterval(() => {
            lobby.allDeactives().forEach((websocket) => {
                websocket.close(undefined,`僵尸连接，长连接请发送"${Actions.HEART}"`)
            })
        }, this.DELAY);
    }

    /**
     * 其它工作线程关闭同步线程在线数
     * @param data 路径, 丢失的人数
     */
    private workerDestroy(data: {pathname: string, total: number}[]): void {
        for(let {pathname, total:reduce} of data) {
            let online = this._onlineMap.get(pathname);
            online && this._onlineMap.set(pathname, online - reduce);
        }
    }

    private entry(ws: WebSocket, req: http.IncomingMessage): void {
        this.vaild(req.url).then((pathname) => {
            //监听下个用户登录包
            ws.once(WebSocketEvent.MESSAGE, (data: WebSocket.Data) => {
                clearTimeout(delayid);
                try{
                    let info: {action: string, data: {id: string}} = JSON.parse(data.toString()); 
                    if(info.action === Actions.ENTRY) {
                        checkout((db) => {
                            db.collection('user').findOne({name:info.data.id}).then(data => {
                                if(data) {
                                    this.setAuthUser(info.data.id, ws, pathname);
                                    log(`用户 ${info.action} ${info.data.id} 登录成功,当前线程 PID: ${process.pid}`);
                                }else{
                                    ws.close(undefined,`不存在用户 ${info.data.id} 无法建立连接`);
                                    error(`不存在用户 ${info.data.id} 无法建立连接`)
                                }
                            },reason => {
                                ws.close(undefined,`无效用户 ${info.data.id}`);
                            }).then(() => {
                                restore(db);
                            })
                        },reason => {
                            ws.close(undefined,`无法建立数据库连接`)
                        })
                    }else
                        ws.close(undefined, `需要发送登录action "${Actions.ENTRY}"`);
                }catch(e){
                    ws.close(undefined, '用户认证消息参数错误');
                    return;
                }
            })
            let delayid = setTimeout(() => ws.close(), 30000);
        },(reason) => {
            error(`不存在的连接路径: ${reason}`)
            ws.close(undefined, reason);
        }).catch((reason) => {
            error('无法验证访问路径，请检查代码:' + reason);
            ws.close(undefined, reason);
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

    /**
     * 发送消息到主线程
     * @param pathname (房间)路径
     * @param action 动作标识
     * @param data 数据
     */
    private sendMaster(pathname: string, action: string,data:any): void {
        cluster.worker.send({action, data, pathname});
    }

    /**
     * 保存连接信息
     * @param id 用户id
     * @param ws 连接ws
     * @param pathname 连接路径
     */
    private setAuthUser(id: string,ws: WebSocket,pathname: string): void {
        ws.on(WebSocketEvent.MESSAGE, data => {
            let msg: {action: string, data:any} = JSON.parse(data.toString());
            switch(msg.action){
                case Actions.POST:
                    //1.回复用户自己
                    response(ws, {status: WebSocketStatus.POST, data: msg.data});
                    //2.分发本线程房间
                    lobby.get(pathname).broadcast(JSON.stringify({action:Actions.POST,data:msg.data}),ws);
                    //3.同步其它线程改
                    this.sendMaster(pathname, msg.action, msg.data);
                break;
                case Actions.ONLINE:
                    let total = this._onlineMap.get(pathname)||1;
                    response(ws, {status: WebSocketStatus.ONLINE, data: total});
                    break;
                case Actions.HEART:
                    //用户心跳 激活当前连接
                    lobby.get(pathname).active(ws);
                break;
            }
        });
        ws.on(WebSocketEvent.ERROR,err => {});
        //客户端关闭
        ws.on(WebSocketEvent.CLOSE,(code,message) => {
            ws.removeAllListeners();
            this.reduceThisWorker(pathname);
            lobby.get(pathname).remove(id,ws);
            //通知主线程连接关闭
            this.sendMaster(pathname, Actions.LEAVE, {
                    pathname,
                    uid:id,
                });
        });
        this.addThisWorker(pathname);
        //按房间分组用户，允许用户建立多个连接
        lobby.get(pathname).add(id, ws);
        response(ws, {status: WebSocketStatus.AUTH, data: {level: 15, admin: true}});
        //通知主线程用户在那个房间，那个线程
        this.sendMaster(pathname, Actions.ENTRY, {
            pathname,
            uid:id
        });
    }
    /**
     * 增加本线程人数
     * @param pathname 房间（路径）
     */
    private addThisWorker(pathname: string): void {
        let total = this._onlineMap.get(pathname) || 0;
        this._onlineMap.set(pathname, ++total);
    }
    /**
     * 减少本线程人数
     * @param pathname 房间（路径）
     */
    private reduceThisWorker(pathname: string): void {
        let total = this._onlineMap.get(pathname) || 0;
        this._onlineMap.set(pathname, --total);
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

/**
 * 回复用户发送内容
 * @param ws 
 * @param data 
 */
const response = (ws: WebSocket, data: {status: number, data: any}) => {
    ws.send(JSON.stringify(data));
}

export {DanmuServer};