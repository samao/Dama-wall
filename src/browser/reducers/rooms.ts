import Action, { Type } from "../actions";

import { combineReducers } from "redux";
import { RoomData, rooms } from "../states";

export interface RoomReducer {
	ready: boolean;
	data: RoomData[];
}

//活动列表数据
export default function roomsReducer(
	state: RoomReducer = rooms,
	action: Action
): RoomReducer {
	switch (action.type) {
		case Type.ROOM_READY:
			return { data: action.data, ready: true };
		case Type.CREATE_ACT_SUCCESS:
			return { ready: state.ready, data: [action.data, ...state.data] };
		case Type.ACT_DELETED:
			return {
				ready: state.ready,
				data: state.data.filter(e => e.rid !== action.rid)
			};
	}
	return state;
}
