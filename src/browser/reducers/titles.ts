/*
 * @Author: iDzeir 
 * @Date: 2018-01-12 14:13:32 
 * @Last Modified by:   iDzeir 
 * @Last Modified time: 2018-01-12 14:13:32 
 */
import Action from "../actions";

export default function titles(state: string[], action: Action): string[] {
	return ["活动号", "活动标题", "描述", "地址", "二维码", "操作"];
}
