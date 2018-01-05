/*
 * @Author: iDzeir 
 * @Date: 2017-12-19 12:28:33 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-04 10:35:20
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import axios from "axios";
import UserCenter from "./components/center";
import reducer from "./reducers";
import { RoomData } from "./states/rooms";
import { roomReady, bansReady } from "./actions";

import { Provider } from "react-redux";
import { createStore } from "redux";

import { SuccessType, FailType, isSuccessType } from "../utils/feedback";
import { log, error } from "../utils/log";

const store = createStore(reducer);

async function getActis(): Promise<RoomData[]> {
	const { data } = await axios.post("http://dama.cn:3000/api/activities");
	if (isSuccessType(data)) return data.data;
	return [];
}

async function getBans(): Promise<{ uBans: string[]; sBans: string[] }> {
	const { data } = await axios.get("http://dama.cn:3000/api/word");
	if (isSuccessType(data)) return data.data;
	return { uBans: [], sBans: [] };
}

Promise.all([getActis(), getBans()])
	.then(([acts, bans]) => {
		store.dispatch(roomReady(acts));
		store.dispatch(bansReady(bans));

		ReactDOM.render(
			<Provider store={store}>
				<UserCenter />
			</Provider>,
			document.querySelector("#app")
		);
	})
	.catch(e => {
		ReactDOM.render(<p>{e}</p>, document.querySelector("#app"));
	});
