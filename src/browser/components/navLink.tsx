import * as React from 'react';
import { connect } from "react-redux";

export default class NavLink extends React.Component {
    render() {
        return (
            <li>
                {this.props.children}
            </li>
        )
    }
}