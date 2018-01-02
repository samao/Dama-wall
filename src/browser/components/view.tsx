import * as React from 'react';
import { connect } from 'react-redux';

import { LinkTo } from '../states/links';
import ActBox from './actBox';
import CreateAct from './createAct';

//view 映射
const viewStacks = [
    <ActBox />,
    <div>
        敏感词
    </div>,
    <div>
        账号管理
    </div>,
    <CreateAct />
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