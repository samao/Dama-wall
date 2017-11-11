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
                if(!map.has(DFA_TAG.TAG))
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

    getBans(msg: string, owner: string): Set<string> {
        const bans = new Set<string>();
        for(let i = 0; i< msg.length; ++i) {
            const size = this.checkoutBan(msg, i, owner);
            if(size > 0){
                bans.add(msg.substr(i,size))
                i += size - 1;
            }
        }
        return bans;
    }

    checkoutBan(msg: string, begin: number, owner: string): number {
        let flag = false;
        let matchLen = 0;
        //查找通用敏感词
        let rootMap = this._sensitiveMap.get('admin');
        if(rootMap) {
            for(let i = begin; i< msg.length; ++i) {
                const char = msg.charAt(i);
                rootMap = <Map<string, any>>rootMap.get(char);
                if(rootMap) {
                    ++matchLen;
                    if(rootMap.get('isEnd') === DFA_TAG.END) flag = true;
                }else {
                    break;
                }
            }
        }
        if(matchLen < 1 || !flag) matchLen = 0;
        
        //查找房主自定义敏感词
        rootMap = this._sensitiveMap.get(owner);
        if(rootMap) {
            for(let i = begin; i< msg.length; ++i) {
                const char = msg.charAt(i);
                rootMap = <Map<string, any>>rootMap.get(char);
                if(rootMap) {
                    ++matchLen;
                    if(rootMap.get('isEnd') === DFA_TAG.END) flag = true;
                }else {
                    break;
                }
            }
        }
        if(matchLen < 1 || !flag) matchLen = 0;

        return matchLen;
    }

    replace(msg: string, owner: string): string {
        const bans = [...this.getBans(msg, owner)];
        return msg.replace(new RegExp(bans.join('|'),'ig'), (banword) => {
            return '*'.repeat(banword.length);
        })
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