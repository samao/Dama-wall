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
import { roomReady } from "./actions";

import { Provider } from "react-redux";
import { createStore } from "redux";

import { SuccessType, FailType, isSuccessType } from "../utils/feedback";
import { log, error } from "../utils/log";

const store = createStore(reducer);

async function getActis() {
	const { data } = await axios.post("http://dama.cn:3000/api/activities");
	return data;
}

getActis().then((data: SuccessType | FailType) => {
	if (isSuccessType(data)) {
		store.dispatch(roomReady(data.data));
	} else {
		error(`获取活动数据失败 ${data.reason}`);
	}
});

ReactDOM.render(
	<Provider store={store}>
		<UserCenter />
	</Provider>,
	document.querySelector("#app")
);
