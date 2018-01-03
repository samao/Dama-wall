import Action, { Type } from '../actions';

import { combineReducers } from "redux";
import { links, Link, view, RoomData, rooms } from '../states';

//顶部导航数据
function navlinks(state:Link[] = links, action:Action): Link[] {
    return state
}

//活动列表数据
function roomsReducer(state: RoomData[] = rooms, action: Action): RoomData[] {
    switch(action.type) {
        case Type.ROOM_READY:
            return action.data;
        case Type.CREATE_ACT_SUCCESS:
            return [action.data, ...state];
        case Type.ACT_DELETED:
            return state.filter(e => e.rid !== action.rid);
    }
    return state;
}

//当前view页面
function views(state:number = view ,action: Action): number {
    switch(action.type) {
        case Type.Router:
            return action.view;
    }
    return state;
}

//创建活动输入框状态
function act(state: boolean = false, action: Action): boolean {
    switch(action.type) {
        case Type.CREATE_ACT:
            return true;
    }
    return false;
}

//reducer组合数据
const combine = {navlinks, rooms:roomsReducer, views, act};

type Reducer = typeof combine;

export default combineReducers<Reducer>(combine)