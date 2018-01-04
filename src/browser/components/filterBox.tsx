/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 17:20:47 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-04 18:41:25
 */

import * as React from "react";
import { connect } from "react-redux";
import Filter from "./Filter";

export default class FilterBox extends React.Component {
	render() {
		return (
			<div className="container-fluid">
                <h4>系统敏感词</h4>
				<Filter disabled />
                <hr className="line" />
                <h4>用户自定义敏感词</h4>
				<Filter disabled={false} />
				<button className="btn btn-primary pull-right">应用</button>
			</div>
		);
	}
}
