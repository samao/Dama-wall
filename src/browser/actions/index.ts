import { RoomData } from '../states/rooms';
export enum Type {
    Router = 'linkTo',
    ROOM_READY = 'roomReady',
    CREATE_ACT = 'createAct',
    CREATE_ACT_FAIL = 'createActFail',
    CREATE_ACT_SUCCESS = 'createActSuccess'
}

export default interface Action {
    type: string;
    [index: string]: any;
}

export function linkTo(view: number): Action {
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

export const createAct = {
    create: {
        type:Type.CREATE_ACT
    },
    fail: {
        type: Type.CREATE_ACT_FAIL
    },
    success: {
        type: Type.CREATE_ACT_SUCCESS
    }
};

