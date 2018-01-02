/*
 * @Author: iDzeir 
 * @Date: 2017-12-19 12:28:33 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-02 11:47:21
 */

import * as $ from 'jquery';
//import { log, error } from "../utils/log";
//import { loadPug } from './utils/pugUtil';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import UserCenter from "./components/center";
import reducer from './reducers/userReducer';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

/*
$(() => {
    const container = $('.wraper');
    $('.nav li a').click(function() {
        const url = $(this).attr('data');
        if(url)
            loadPug(container, url);
    })
})
*/
const store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
        <UserCenter />
    </Provider>, $('#app').get(0));