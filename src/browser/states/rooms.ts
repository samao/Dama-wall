/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 10:31:02 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-08 18:21:31
 */
export interface RoomData {
	rid: string;
	title: string;
	description: string;
	[index: string]: any;
}

const rooms: RoomData[] = [];

export default {
	ready: false,
	data: rooms
};
