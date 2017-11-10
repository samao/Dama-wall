import { checkout, restore } from './pool';
import {log, error} from '../../utils/log';

export const sensitiveMap: Map<string, Map<string, any>> = new Map();


export enum DFA_TAG {
    //默认索引
    DEFAULT,
    //结束点索引
    END,
    //索引字段
    TAG = 'isEnd'
}

/**
 * 初始化敏感词DFA解构
 * @param keywords
 */
export function buildDFA(words: string[]) {
    sensitiveMap.clear();
    const keywords = new Set(words);
    for(const word of keywords) {
        let curMap: Map<string, any> = sensitiveMap;
        for(let i = 0; i < word.length; ++i) {
            const char = word.charAt(i);
            let map: Map<string, any> = curMap.get(char);
            if(!map){
                map = new Map();
                map.set(DFA_TAG.TAG, DFA_TAG.DEFAULT);
                curMap.set(char, map);
            }
            curMap = curMap.get(char);
        }
        curMap.set(DFA_TAG.TAG, DFA_TAG.END);
    }
}