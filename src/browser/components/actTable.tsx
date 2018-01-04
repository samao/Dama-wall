/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 10:18:35 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-04 10:22:33
 */

import * as React from "react";
import axios from "axios";
import { connect } from "react-redux";

import Table from "./table";
import Action, { act } from "../actions";
import { RoomData } from "../states/rooms";
import { SuccessType, FailType, isSuccessType } from "../../utils/feedback";
import { log, error } from "../../utils/log";

export interface ActTableProps {
	delAct: (rid: string) => any;
	rooms: RoomData[];
}

class ActTable extends React.Component<ActTableProps> {
	componentDidMount() {
		this.onDelAct = this.onDelAct.bind(this);
	}

	async delActByid(rid: string) {
		const { data } = await axios.delete(
			`http://dama.cn:3000/api/activity/${rid}`
		);
		return data;
	}

	//删除活动
	onDelAct(rid: string) {
		const { delAct } = this.props;
		this.delActByid(rid).then((data: SuccessType | FailType) => {
			if (isSuccessType(data)) {
				log("删除成功", rid);
				delAct(rid);
			} else {
				error("删除失败");
			}
		});
	}

	render() {
		const { rooms } = this.props;
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
									<a
										target="_blank"
										href={`http://dama.cn:3000/danmu/${e.rid}`}
									>
										{`http://dama.cn:3000/danmu/${e.rid}`}
									</a>
								</td>
								<td>
									<a target="_blank" href={`http://dama.cn:3000/qr/${e.rid}`}>
										<img
											src={`http://dama.cn:3000/qr/${e.rid}`}
											alt={e.title}
										/>
									</a>
								</td>
								<td>
									<button
										className="btn btn-danger btn-xs"
										onClick={() => this.onDelAct(e.rid)}
									>
										删除
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		);
	}
}

function stateToProps(state: any) {
	return {
		rooms: state.rooms
	};
}

function dispatchToProps(dispatch: (action: Action) => any) {
	return {
		delAct: (rid: string) => {
			dispatch(act.delete(rid));
		}
	};
}

export default connect(stateToProps, dispatchToProps)(ActTable);
