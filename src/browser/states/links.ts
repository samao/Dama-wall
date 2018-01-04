/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 10:30:55 
 * @Last Modified by:   iDzeir 
 * @Last Modified time: 2018-01-04 10:30:55 
 */
export enum LinkTo {
	ACT,
	FILTER,
	ACCOUNT,
	CREATE_ROOM
}

export interface Link {
	label: string;
	to: LinkTo;
}
export const links: Link[] = [
	{ label: "活动中心", to: LinkTo.ACT },
	{ label: "敏感词设置", to: LinkTo.FILTER },
	{ label: "账号管理", to: LinkTo.ACCOUNT }
];
