import { checkout, restore } from './pool';
import {log, error} from '../../utils/log';

class DFA {
    private _sensitiveMap = new Map<string, Map<string, any>>()
    
    constructor(){}

    /**
     * 初始化敏感词DFA解构
     * @param keywords
     */
    private buildDFA(words: string[],owner: string) {
        const userWordMap = new Map<string, any>();
        for(const word of words) {
            let curMap: Map<string, any> = userWordMap;
            for(let i = 0; i < word.length; ++i) {
                const char = word.charAt(i);
                let map: Map<string, any> = curMap.get(char) || new Map();
                map.set(DFA_TAG.TAG, DFA_TAG.DEFAULT);
                curMap.set(char, map);
                curMap = curMap.get(char);
            }
            curMap.set(DFA_TAG.TAG, DFA_TAG.END);
        }
        this._sensitiveMap.set(owner, userWordMap);
    }

    buildBanTree(banMap: Map<string,string[]>): void {
        for(const [owner, words] of banMap) {
            this.buildDFA(words, owner);
        }
    }

    getBans(msg: string): Set<string> {
        const bans = new Set<string>();

        return bans;
    }

    checkoutBan(msg: string, begin: number): number {
        let flag = false;
        let matchLen = 0;

        return matchLen;
    }

    replace(msg: string, replaceChar: string): string {
        let result = msg;

        return result;
    }
}

export const dfa = new DFA();

export enum DFA_TAG {
    //默认索引
    DEFAULT,
    //结束点索引
    END,
    //索引字段
    TAG = 'isEnd'
}