/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 10:30:36 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-08 17:59:53
 */
import Action, { Type } from "../actions";

import { combineReducers } from "redux";
import roomsReducer from "./rooms";
import sensitivesReducer from "./sensitives";
import { links, Link, view } from "../states";

//顶部导航数据
function navlinks(state: Link[] = links, action: Action): Link[] {
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

//reducer组合数据
const combine = {
	navlinks,
	room: roomsReducer,
	views,
	act,
	banwords: sensitivesReducer
};

type Reducer = typeof combine;

export default combineReducers<Reducer>(combine);
