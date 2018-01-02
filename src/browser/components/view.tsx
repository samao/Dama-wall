import * as React from 'react';
import { connect } from 'react-redux';

import { LinkTo } from '../states/links';
import ActTable from './actTable';

//view 映射
const viewStacks = [
    <div className="activity" >
        <button className="btn btn-default" id="create">新建活动</button>
        <ActTable />
    </div>,
    <div>
        敏感词
    </div>,
    <div>
        账号管理
    </div>
]

class View extends React.Component<{index: number}> {
    render() {
        return (
            <div className="wraper">
               {viewStacks[this.props.index]}
            </div>
        )
    }
}

export default connect((state: any) => {
    return {
        index:state.views
    }
})(View);