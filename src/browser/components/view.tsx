/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 10:30:13 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-04 17:43:35
 */
import * as React from "react";
import { connect } from "react-redux";

import { LinkTo } from "../states/links";
import ActBox from "./actBox";
import CreateAct from "./createAct";
import SensitiveBox from "./sensitiveBox";

//view 映射
const viewStacks = [
	<ActBox />,
	<SensitiveBox />,
	<div>账号管理</div>,
	<CreateAct />
];

class View extends React.Component<{ index: number }> {
	render() {
		return <div className="wraper">{viewStacks[this.props.index]}</div>;
	}
}

export default connect((state: any) => {
	return {
		index: state.views
	};
})(View);
