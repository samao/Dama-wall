/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 10:26:47 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-12 14:19:50
 */
import * as React from "react";
import { connect } from "react-redux";

import Thead, { TheadProps } from "./thead";

interface TableProps {
	titles: string[];
	children?: React.ReactNode;
}

class Table extends React.Component<TableProps> {

	shouldComponentUpdate(nextProps:TableProps) {
		return this.props.children !== nextProps.children;
	}

	render() {
		const { titles } = this.props;
		return (
			<table className="table table-striped table-condensed table-hover text-center">
				{titles.length > 0 ? <Thead titles={titles} /> : null}
				{this.props.children}
			</table>
		);
	}
}

function stateToProps({ titles }: { titles: string[] }): TableProps {
	return {
		titles
	};
}

export default connect(stateToProps)(Table);
