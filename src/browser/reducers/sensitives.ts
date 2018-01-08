import Action, { Type } from "../actions";

import { sensitives, SensitiveData } from "../states";

interface SensitiveReducer {
	ready: boolean;
	data: SensitiveData;
}

function has({ sBans, uBans }: SensitiveData, word: string): boolean {
	return sBans.indexOf(word) !== -1 || uBans.indexOf(word) !== -1;
}

export default function banwords(
	sen: SensitiveReducer = sensitives,
	action: Action
): SensitiveReducer {
    console.log('Reducer', action.type)
	switch (action.type) {
		case Type.SENSITIVE_READY:
			return { ready: true, data: action.data };
		case Type.SENSITIVE_ADD:
			if (has(sen.data, action.word)) return sen;
			return {
				...sen,
				data: { ...sen.data, uBans: [...sen.data.uBans, action.word] }
			};
		case Type.SENSITIVE_DEL:
			return {
				...sen,
				data: {
					...sen.data,
					uBans: sen.data.uBans.filter(e => e !== action.word)
				}
			};
		case Type.SENSITIVE_POP:
			return {
				...sen,
				data: { ...sen.data, uBans: sen.data.uBans.slice(0, -1) }
			};
	}
	return sen;
}
