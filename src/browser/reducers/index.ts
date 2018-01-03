import Action, { Type } from '../actions';

import { combineReducers } from "redux";
import { links, Link, view, RoomData, rooms } from '../states';

function navlinks(state:Link[] = links, action:Action): Link[] {
    return state
}

function roomsReducer(state: RoomData[] = rooms, action: Action): RoomData[] {
    switch(action.type) {
        case Type.ROOM_READY:
            return action.data;
        case Type.CREATE_ACT_SUCCESS:
            return [action.data, ...state];
    }
    return state;
}

function views(state:number = view ,action: Action): number {
    switch(action.type) {
        case Type.Router:
            return action.view;
    }
    return state;
}

function createAct(state: boolean = false, action: Action): boolean {
    switch(action.type) {
        case Type.CREATE_ACT:
            return true;
    }
    return false;
}

const combine = {navlinks, rooms:roomsReducer, views, createAct};

type Reducer = typeof combine;

export {
    Reducer
}

export default combineReducers<Reducer>(combine)