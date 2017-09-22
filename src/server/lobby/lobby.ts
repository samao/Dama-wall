import { IRoom ,Room } from "./room";
import * as WebSocket from 'ws';

class Lobby {

    private rooms:Map<string, IRoom> = new Map();

    private add(rid: string):IRoom {
        let room = this.rooms.get(rid);
        if(!room) {
            room = new Room(rid);
            this.rooms.set(rid,room);
        }
        return room;
    }
   
    has(rid: string): boolean {
        return this.rooms.has(rid);
    }
    
    get(rid: string): IRoom {
        return this.add(rid);
    }
    /**
     * 工作检查心跳检查轮询
     */
    allDeactives(): WebSocket[] {
        let websockets = new Array<WebSocket>();
        for(let [,room] of this.rooms) {
            websockets.push(...room.deactive())
        }
        return websockets;
    }
}

export const lobby = new Lobby();