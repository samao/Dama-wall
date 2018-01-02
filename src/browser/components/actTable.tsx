import * as React from 'react';
import { connect } from 'react-redux';

import Table from './table';

import {RoomData} from '../states/rooms';

export interface ActTableProps {
    rooms: RoomData[];
}

class ActTable extends React.Component<ActTableProps> {
    render() {
        const {rooms} = this.props;
        return (
            <Table>
                <tbody id="actBody">
                    {rooms.map(e => {
                        return (
                            <tr>
                                <td>{e.rid}</td>
                                <td>{e.title}</td>
                                <td>{e.description}</td>
                                <td>
                                    <a target="_blank" href={`http://dama.cn:3000/danmu/${e.rid}`}>
                                        {`http://dama.cn:3000/danmu/${e.rid}`}
                                    </a>
                                </td>
                                <td>
                                    <a target="_blank" href={`http://dama.cn:3000/qr/${e.rid}`}>
                                        <img src={`http://dama.cn:3000/qr/${e.rid}`} alt={e.title}/>
                                    </a>
                                </td>
                                <td>
                                    <button className="btn btn-danger btn-xs">删除</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        )
    }
}

function stateToProps(state: any): ActTableProps {
    return {
        rooms: state.rooms
    }
}

export default connect(stateToProps)(ActTable);