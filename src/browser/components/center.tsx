import * as React from "react";
import Navgator from "./navgator";
import View from "./view";

export default class UserCenter extends React.Component {
	render() {
		return (
			<div>
				<Navgator />
				<View />
			</div>
		);
	}
}
