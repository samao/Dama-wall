/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 10:30:36 
 * @Last Modified by:   iDzeir 
 * @Last Modified time: 2018-01-04 10:30:36 
 */
import Action, { Type } from "../actions";

import { combineReducers } from "redux";
import {
	links,
	Link,
	view,
	RoomData,
	rooms,
	sensitives,
	SensitiveData
} from "../states";

//顶部导航数据
function navlinks(state: Link[] = links, action: Action): Link[] {
	return state;
}

//活动列表数据
function roomsReducer(state: RoomData[] = rooms, action: Action): RoomData[] {
	switch (action.type) {
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
function views(state: number = view, action: Action): number {
	switch (action.type) {
		case Type.Router:
			return action.view;
	}
	return state;
}

//创建活动输入框状态
function act(state: boolean = false, action: Action): boolean {
	switch (action.type) {
		case Type.CREATE_ACT:
			return true;
	}
	return false;
}

function has({ sBans, uBans }: SensitiveData, word: string): boolean {
	return sBans.indexOf(word) !== -1 || uBans.indexOf(word) !== -1;
}

function banwords(
	sen: SensitiveData = sensitives,
	action: Action
): SensitiveData {
	switch (action.type) {
		case Type.SENSITIVE_READY:
			return action.data;
		case Type.SENSITIVE_ADD:
			if (has(sen, action.word)) return sen;
			return { ...sen, uBans: [...sen.uBans, action.word] };
		case Type.SENSITIVE_DEL:
			return { ...sen, uBans: sen.uBans.filter(e => e !== action.word) };
		case Type.SENSITIVE_POP:
			return { ...sen, uBans: sen.uBans.slice(0, -1) };
	}
	return sen;
}

//reducer组合数据
const combine = { navlinks, rooms: roomsReducer, views, act, banwords };

type Reducer = typeof combine;

export default combineReducers<Reducer>(combine);
