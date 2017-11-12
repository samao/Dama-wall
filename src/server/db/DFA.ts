import { checkout, restore } from './pool';
import {log, error} from '../../utils/log';

interface IWord {
    isEnd:boolean;
    [index: string]: boolean|IWord;
}

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
        let adminflag = false;
        let adminMatch = 0;
        //查找通用敏感词
        let rootAdminMap = this._sensitiveMap.get('admin')||new Map<string, any>();

        let masterflag = false;
        let masterMatch = 0;
        let rootMasterMap = this._sensitiveMap.get(owner)||new Map<string, any>();

        const firstChar = msg.charAt(begin);

        if(!rootAdminMap.has(firstChar)&&!rootMasterMap.has(firstChar)) return 0;

        let adminMap:Map<string, any> = rootAdminMap;
        let masterMap:Map<string, any> = rootMasterMap;
        
        for(let i = begin; i< msg.length; ++i) {
            const char = msg.charAt(i); 
            if(rootAdminMap.has(firstChar) && !adminflag && adminMap) {
                adminMap = <Map<string, any>>adminMap.get(char);
                if(adminMap) {
                    ++adminMatch
                    if(adminMap.get(DFA_TAG.TAG) === DFA_TAG.END) adminflag = true;
                }
            }
            if(rootMasterMap.has(firstChar) && !masterflag && masterMap) {
                masterMap = <Map<string, any>>masterMap.get(char);
                if(masterMap) {
                    ++masterMatch;
                    if(masterMap.get(DFA_TAG.TAG) === DFA_TAG.END) masterflag = true;
                }
            }
        }
        if(!adminflag) adminMatch = 0;
        if(!masterflag) masterMatch = 0;

        return Math.max(adminMatch, masterMatch);
    }

    replace(msg: string, owner: string): string {
        const bans = [...this.getBans(msg, owner)];
        return msg.replace(new RegExp(bans.join('|'),'ig'), (banword) => {
            const replaceChars = '@#$%&';
            return new Array(banword.length).fill(0).map(() => {
                return replaceChars.charAt(Math.random() * replaceChars.length);
            }).join('') 
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