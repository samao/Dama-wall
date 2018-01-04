/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 17:32:22 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-04 18:29:48
 */
import * as React from "react";
import { connect } from "react-redux";
import Action from "../actions";

class FilterWord extends React.Component<{ disabled:boolean,onDeleted: () => any }> {
	render() {
		const { onDeleted, disabled } = this.props;
		return (
			<button className="btn btn-xs btn-danger word">
				{this.props.children}
				<span onClick={() => !disabled && onDeleted()}>&times;</span>
			</button>
		);
	}
}

function dispatchToProps(dispatch: (action: Action) => any) {
	return {
		onDeleted: () => {
			console.log("删除字段");
		}
	};
}

export default connect(null, dispatchToProps)(FilterWord);
