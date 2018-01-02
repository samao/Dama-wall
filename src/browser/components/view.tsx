import * as React from 'react';
import { connect } from 'react-redux';

class View extends React.Component<{ran: number}> {
    render() {
        return (
            <div className="wraper">
               {this.props.ran}
            </div>
        )
    }
}

export default connect(state => {
    return {
        ran:Math.random()
    }
})(View);