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
     * 房间内的用户连接 每个ws单独id,可以允许客户端多实例连接
     */
    clients:Map<string, WebSocket[]>;
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
}

export class Room implements IRoom {

    private _size: number = 0;
    clients:Map<string, WebSocket[]> = new Map();

    constructor(public id: string) {}

    add(uid: string, ws: WebSocket): void {
        let cons = this.clients.get(uid);
        if(cons) cons.push(ws)
        else this.clients.set(uid, [ws]);
        ++this._size;
    }

    remove(uid: string, ws: WebSocket): void {
        let cons = this.clients.get(uid);
        if(cons && cons.includes(ws)) {
           cons.splice(cons.indexOf(ws), 1);
        }
        --this._size;
    }

    /**
     * 该房间的连接数
     */
    get size(): number {
        return this._size;
    }
}