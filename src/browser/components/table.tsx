import * as React from 'react';
import { connect } from 'react-redux';

import Thead, {TheadProps} from './thead';

interface TableProps {
    titles: string[];
}

class Table extends React.Component<TableProps> {
    render() {
        const {titles} = this.props;
        return (
            <table className="table table-striped table-condensed table-hover text-center">
                {
                    titles.length > 0 ? <Thead titles={titles}/> : null                    
                }
                {
                    this.props.children                 
                }
            </table>
        )
    }
}

function stateToProps(state: {}): TableProps {
    return {
        titles: ['活动号','活动标题','描述','地址','二维码','操作']
    };
}

export default connect(stateToProps)(Table);