/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 10:28:59 
 * @Last Modified by:   iDzeir 
 * @Last Modified time: 2017-11-08 10:28:59 
 */

import * as WebSocket from 'ws';

export interface IRoom {
    /**
     * 房间id
     */
    id: string
    /**
     * 当前room 连接数
     */
    size: number
    /**
     * 添加用户
     * @param uid 用户id
     * @param ws 用户连接websocket
     */
    add(uid: string, ws: WebSocket):void;
    /**
     * 删除用户
     * @param uid 用户id
     * @param ws 用户websocket
     */
    remove(uid: string, ws:WebSocket): void;
    /**
     * 收到心跳，重置次数
     */
    active(ws: WebSocket): void;
    /**
     * 全局检查，减少次数
     * 返回 失效的ws
     */
    deactive(): WebSocket[];
    /**
     * 房间广播
     * @param data 广播消息
     * @param ws 消息来源，默认或者undefined 时发给全部用户。否则传入ws除外
     */
    broadcast(data: string, ws?: WebSocket): void;
}

export class Room implements IRoom {
    /**
     * 心跳丢包容错数 连续3次检查没心跳就丢弃连接
     */
    private readonly MISS_BEATS: number = 3;

    private _size: number = 0;
    /**
     * 房间内的用户连接 每个ws单独id,可以允许客户端多实例连接
     */
    private clients:Map<string, WebSocket[]> = new Map();

    private hearts: Map<WebSocket, number> = new Map();

    constructor(public id: string) {}

    add(uid: string, ws: WebSocket): void {
        let cons = this.clients.get(uid);
        if(cons) cons.push(ws)
        else this.clients.set(uid, [ws]);
        this.hearts.set(ws, this.MISS_BEATS)
        ++this._size;
    }

    remove(uid: string, ws: WebSocket): void {
        let cons = this.clients.get(uid);
        if(cons && cons.includes(ws)) {
           cons.splice(cons.indexOf(ws), 1);
           this.hearts.delete(ws)
        }
        --this._size;
    }

    active(ws: WebSocket): void {
        this.hearts.set(ws, this.MISS_BEATS);
    }

    deactive(): WebSocket[] {
        let websockets = new Array<WebSocket>();
        let entries = this.hearts.entries();
        for(let [ws,times] of entries) {
            if(--times === 0)
                websockets.push(ws);
            else
                this.hearts.set(ws, times);
        }
        return websockets;
    }

    broadcast(data: string, ws?: WebSocket): void {
        for(let [,websockets] of this.clients) {
            websockets.forEach((el) => {
                if(!ws || el !== ws) {
                    el.send(data);
                }
            })
        }
    }

    /**
     * 该房间的连接数
     */
    get size(): number {
        return this._size;
    }
}