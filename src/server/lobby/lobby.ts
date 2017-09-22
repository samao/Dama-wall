import { IRoom ,Room } from "./room";

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
}

export const lobby = new Lobby();