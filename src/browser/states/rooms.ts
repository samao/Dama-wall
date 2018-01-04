/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 10:31:02 
 * @Last Modified by:   iDzeir 
 * @Last Modified time: 2018-01-04 10:31:02 
 */
export interface RoomData {
	rid: string;
	title: string;
	description: string;
	[index: string]: any;
}

export const rooms: RoomData[] = [];
