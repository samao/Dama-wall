import * as React from 'react';
import { connect } from 'react-redux';

import NavLink from './navLink';

interface linkProps {
    label: string;
    to: string;
}

interface NavgatorDispatch {
    onNavTo?: any;
}
interface NavgatorProps extends NavgatorDispatch{
    navlinks: linkProps[];
}

class Navgator extends React.Component<NavgatorProps> {
    render() {
        const { navlinks, onNavTo} = this.props;
        console.log('====');
        console.log(navlinks)
        return (
            <section className="nav">
                <ul className="list-unstyled list-inline">
                    {
                        navlinks.map(e => {
                            return (
                                <NavLink>
                                    <a onClick={() => onNavTo(e.to)}>{e.label}</a>
                                </NavLink> 
                            )
                        })
                    }
                </ul>
            </section>
        )
    }
}

function stateToProps(state:any): NavgatorProps {
    const { navlinks } = state;
    return state;
}

function dispathToProps(dispatch: any): NavgatorDispatch {
    return {
        onNavTo: (to: string) => {
            dispatch({type: 'daohang', to})
        }
    };
}

export default connect(stateToProps, dispathToProps)(Navgator);