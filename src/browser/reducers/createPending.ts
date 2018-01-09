import Action, { Type } from "../actions";

//创建活动状态
export default function act(state: boolean = false, action: Action): boolean {
	switch (action.type) {
		case Type.CREATE_ACT:
			return true;
	}
	return false;
}