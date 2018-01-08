/*
 * @Author: iDzeir 
 * @Date: 2017-12-19 12:28:33 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-08 17:10:37
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import UserCenter from "./components/center";
import reducer from "./reducers";

import { Provider } from "react-redux";
import { createStore } from "redux";

const store = createStore(reducer);

ReactDOM.render(
	<Provider store={store}>
		<UserCenter />
	</Provider>,
	document.querySelector("#app")
);
