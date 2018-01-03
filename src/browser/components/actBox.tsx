import * as React from 'react';
import { connect } from 'react-redux';
import ActTable from './actTable';
import { LinkTo } from '../states/links';
import { linkTo } from '../actions'

export interface ActBoxProps {
    onCreate:any;
}

class ActBox extends React.Component<ActBoxProps> {
    render() {
        const {onCreate} = this.props;
        return (
            <div className="activity" >
                <button className="btn btn-default" id="create" onClick={() => onCreate()}>新建活动</button>
                <ActTable />
            </div>
        )
    }
}

function dispatchToProps(dispatch: any): ActBoxProps {
    return {
        onCreate: () => {
            dispatch(linkTo(LinkTo.CREATE_ROOM))
        }
    }
}

export default connect(null, dispatchToProps)(ActBox);
