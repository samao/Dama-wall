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
    console.log(state.rooms)
    return {
        rooms: state.rooms
    }
    /*
    return {
        rooms: [
            {
                rid:'jiafeiyan',
                title:'dota',
                description:'十大经典战役',
            },
            {
                rid:'maobo',
                title:'二次元美女',
                description:'洛丽塔美少女战士',
            },
            {
                rid:'chibo',
                title:'风暴英雄',
                description:'白痴叫你打游戏',
            }
        ]
    }
    */
}

export default connect(stateToProps)(ActTable);