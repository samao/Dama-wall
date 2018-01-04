/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 10:25:57 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-04 10:26:29
 */
import * as React from "react";
import { connect } from "react-redux";

import { Link } from "../states/links";
import { linkTo } from "../actions";
import NavLink from "./navLink";

interface NavgatorDispatch {
	linkTo?: any;
}
interface NavgatorProps extends NavgatorDispatch {
	navlinks: Link[];
}

class Navgator extends React.Component<NavgatorProps> {
	render() {
		const { navlinks, linkTo } = this.props;
		return (
			<section className="nav">
				<ul className="list-unstyled list-inline">
					{navlinks.map(e => {
						return (
							<NavLink>
								<a onClick={() => linkTo(e.to)}>{e.label}</a>
							</NavLink>
						);
					})}
				</ul>
			</section>
		);
	}
}

function stateToProps(state: { navlinks: Link[] }): NavgatorProps {
	return state;
}

function dispathToProps(dispatch: any): NavgatorDispatch {
	return {
		linkTo: (to: number) => {
			dispatch(linkTo(to));
		}
	};
}

export default connect(stateToProps, dispathToProps)(Navgator);
