/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 17:32:22 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-05 16:35:57
 */
import * as React from "react";
import { connect } from "react-redux";
import Action, { sensitive } from "../actions";

class FilterWord extends React.Component<{
	word: string;
	disabled: boolean;
	onDeleted: (word: string) => any;
}> {
	render() {
		const { onDeleted, disabled, word } = this.props;
		return (
			<span className="word">
				{word}
				<span onClick={() => !disabled && onDeleted(word)}>&times;</span>
			</span>
		);
	}
}

function dispatchToProps(dispatch: (action: Action) => any) {
	return {
		onDeleted: (word: string) => {
			dispatch(sensitive.del(word));
		}
	};
}

export default connect(null, dispatchToProps)(FilterWord);
