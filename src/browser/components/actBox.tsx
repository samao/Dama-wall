/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 10:23:04 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-08 18:22:28
 */

import * as React from "react";
import axios from "axios";
import { connect } from "react-redux";
import ActTable from "./actTable";
import { LinkTo } from "../states/links";
import { linkTo } from "../actions";

import { roomReady } from "../actions";
import { RoomData } from "../states/rooms";
import { SuccessType, FailType, isSuccessType } from "../../utils/feedback";
import { log, error } from "../../utils/log";

export interface ActBoxProps {
	ready: boolean;
	onCreate: any;
	onData: any;
}

class ActBox extends React.Component<ActBoxProps> {
	async getActis(): Promise<RoomData[]> {
		const { data } = await axios.post("http://dama.cn:3000/api/activities");
		if (isSuccessType(data)) return data.data;
		return [];
	}

	componentWillMount() {
		const { onData, ready } = this.props;
		if (ready) return;
		this.getActis()
			.then(data => {
				onData(data);
			})
			.catch(reason => error(`请求活动数据失败: ${reason}`));
	}

	render() {
		const { onCreate } = this.props;
		return (
			<div className="activity">
				<button
					className="btn btn-default"
					id="create"
					onClick={() => onCreate()}
				>
					新建活动
				</button>
				<ActTable />
			</div>
		);
	}
}

function stateToProps({ room: { ready } }: any) {
	return {
		ready
	};
}

function dispatchToProps(dispatch: any) {
	return {
		onCreate: () => {
			dispatch(linkTo(LinkTo.CREATE_ROOM));
		},
		onData: (data: RoomData[]) => {
			dispatch(roomReady(data));
		}
	};
}

export default connect(stateToProps, dispatchToProps)(ActBox);
