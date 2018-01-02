import { RoomData } from '../states/rooms';
export enum Type {
    Router = 'linkTo',
    ROOM_READY = 'roomReady'
}

export default interface Action {
    type: string;
    [index: string]: any;
}

export function linkTo(view: string): Action {
    return {
        type: Type.Router,
        view
    }
}

export function roomReady(data: RoomData[]): Action {
    return {
        type:Type.ROOM_READY,
        data
    }
}