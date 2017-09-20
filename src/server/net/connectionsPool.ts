import * as WebSocket from 'ws'

class ConnectionsPool {

    private _map: Map<string,WebSocket>;

    constructor() {
        this._map = new Map<string,WebSocket>();
    }

    /**
     * 添加用户连接管理
     * @param key 用户标识
     * @param ws 用户连接
     */
    add(key: string, ws: WebSocket):boolean {
        if(this.has(key)) return false;
        this._map.set(key, ws);
        return true;
    }

    /**
     * 用户是否已经连接
     * @param el 用户标识或者ws
     */
    has(el: string | WebSocket):boolean {
        if(typeof el === 'string') {
            return this._map.has(el);
        }
        const allws = this._map.values();
        let node: {done: boolean, value: WebSocket};
        do{
            node = allws.next();
            if(node.value === el) return true;
        }while(!node.done)
        
        return false;
    }

    /**
     * 移除用户
     * @param el 用户标识或者ws
     */
    remove(el: string|WebSocket): boolean {
        if(this.has(el)){
            if(typeof el === 'string') {
                this._map.delete(el);
            }else{
                const allws = this._map.entries();
                let node: {done: boolean,value: [string,WebSocket]};
                do{
                    node = allws.next();
                    const {value:[key, ws]} = node;
                    if(ws === el) {
                        this._map.delete(key);
                        return true;
                    }
                }while(!node.done)
            }
            return true;
        }
        return false;
    }

    get size(): number {
        return this._map.size;
    }
}

let connections = new ConnectionsPool();

export {connections};