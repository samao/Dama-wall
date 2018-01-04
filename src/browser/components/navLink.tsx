/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 10:26:36 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-04 10:27:56
 */
import * as React from "react";
import { connect } from "react-redux";

export default class NavLink extends React.Component {
	render() {
		return <li>{this.props.children}</li>;
	}
}
