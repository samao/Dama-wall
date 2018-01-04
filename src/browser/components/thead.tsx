/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 10:30:06 
 * @Last Modified by:   iDzeir 
 * @Last Modified time: 2018-01-04 10:30:06 
 */
import * as React from "react";

export interface TheadProps {
	titles: string[];
	[index: string]: any;
}

export default class Thead extends React.Component<TheadProps> {
	render() {
		const { titles } = this.props;
		return (
			<thead>
				<tr>
					{titles.map(e => {
						return <td>{e}</td>;
					})}
				</tr>
			</thead>
		);
	}
}
