/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 10:20:56 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-12 14:39:30
 */

import { RoomData } from "../states/rooms";

export enum Type {
	LINK_TO = "linkTo",
	ROOM_READY = "roomReady",
	CREATE_ACT = "createAct",
	CREATE_ACT_FAIL = "createActFail",
	CREATE_ACT_SUCCESS = "createActSuccess",
	ACT_DELETED = "actDeleted",

	SENSITIVE_READY = "sensitiveReady",
	SENSITIVE_ADD = "sensitiveAdd",
	SENSITIVE_DEL = "sensitiveDel",
	SENSITIVE_POP = "sensitivePop",
	SENSITIVE_POST = "sensitivePost"
}

export default interface Action {
	type: string;
	[index: string]: any;
};

export function linkTo(view: number): Action {
	return {
		type: Type.LINK_TO,
		view
	};
}

export function roomReady(data: RoomData[]): Action {
	return {
		type: Type.ROOM_READY,
		data
	};
}

export function bansReady(data: any): Action {
	return {
		type: Type.SENSITIVE_READY,
		data
	};
}

export const sensitive = {
	add: (word: string) => ({
		type: Type.SENSITIVE_ADD,
		word
	}),
	del: (word: string) => ({
		type: Type.SENSITIVE_DEL,
		word
	}),
	pop: {
		type: Type.SENSITIVE_POP
	},
	post: {
		type: Type.SENSITIVE_POST
	}
};

export const act = {
	create: {
		type: Type.CREATE_ACT
	},
	fail: {
		type: Type.CREATE_ACT_FAIL
	},
	success: {
		type: Type.CREATE_ACT_SUCCESS
	},
	delete: (rid: string) => ({
		type: Type.ACT_DELETED,
		rid
	})
};
