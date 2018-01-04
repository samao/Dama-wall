/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 17:25:59 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-04 18:42:13
 */
import * as React from "react";
import { connect } from "react-redux";

import FilterWord from "./filterWord";

export interface FilterProps {
	words: string[];
	disabled: boolean;
}

class Filter extends React.Component<FilterProps> {
	render() {
		const { words, disabled } = this.props;
		return (
			<fieldset disabled={disabled}>
				<div className="filter-box">
					{words.map(e => {
						return <FilterWord disabled={disabled}>{e}</FilterWord>;
					})}
				</div>
			</fieldset>
		);
	}
}

function stateToProps(state: any) {
	return {
		words: ["王二小", "nihao", "666",'法轮功','吃鸡主播','挂比'] //state.filter.filter(e => e.owner === 'admin')
	};
}

export default connect(stateToProps)(Filter);
