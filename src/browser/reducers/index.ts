/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 10:30:36 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-08 17:59:53
 */
import Action, { Type } from "../actions";

import { combineReducers } from "redux";
import { view } from "../states";
import roomsReducer from "./rooms";
import sensitivesReducer from "./sensitives";
import navlinks from "./navs";
import views from './views';
import pending from './createPending';

//reducer组合数据
const combine = {
	navlinks,
	room: roomsReducer,
	views,
	pending,
	banwords: sensitivesReducer
};

type Reducer = typeof combine;

export default combineReducers<Reducer>(combine);
