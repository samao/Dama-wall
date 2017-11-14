import {log, error} from './log';

//敏感词匹配数据
interface IMatch {
    size: number;
    end: boolean;
}
//敏感词节点
interface IDelete {
	delete(node: any): void;
	get(key: any): any;
	set(key: any, value: any): any;
}
//敏感词删除节点组
interface INode {
    parent:IDelete;
    child: string;
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
                const char = word.charAt(i).toLocaleLowerCase();
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

    /**
     * 构建DFA数据模型
     * @param banMap 用户/敏感词组 数据
     */
    buildBanTree(banMap: Map<string,string[]>): void {
        for(const [owner, words] of banMap) {
            this.buildDFA(words, owner);
        }
    }

    /**
     * 添加一个敏感词到数据模型
     * @param word 敏感词
     * @param owner 房主昵称
     */
    addBanWord(word: string, owner: string): void {
        let node = this._sensitiveMap.get(owner);
        if(!node) {
            node = new Map<string, any>();
            this._sensitiveMap.set(owner, node);
        }

        for(const char of word) {
            if(!node.has(char)) {
                let map: Map<string, any> = new Map();
                map.set(DFA_TAG.TAG, DFA_TAG.DEFAULT)
                node.set(char.toLocaleLowerCase(), map);
            }
            node = <Map<string, any>>node.get(char.toLocaleLowerCase())
        }
        node.set(DFA_TAG.TAG, DFA_TAG.END);
    }

    /**
     * 从数据模型删除一个敏感词
     * @param word 敏感词
     * @param owner 房主昵称
     */
    removeBanWord(word: string, owner: string): void {
        let nodes: INode[] = [];
        
        let node = this._sensitiveMap.get(owner);
        if(node) {
            //查找敏感词节点
            for(const char of word) {
                if(!node.has(char.toLocaleLowerCase())) return;
                const parent = node;
                node = <Map<string, any>>(node.get(char.toLocaleLowerCase()));
                nodes.push({parent, child: char.toLocaleLowerCase()});
			}
			//重置删除敏感词结束标识
            node.set(DFA_TAG.TAG, DFA_TAG.DEFAULT);
            //节点倒置
            nodes.reverse();
            //逆向删除敏感词节点数据
			for (const { parent, child } of nodes) {
                const childNode = parent.get(child);
                if(childNode.get(DFA_TAG.TAG) === DFA_TAG.END) break;
                if(childNode.size === 1)
                    parent && parent.delete(child)
            }
        }
    }

    /**
     * 从msg中解析敏感词
     * @param msg 消息
     * @param owner 房主
     */
    private getBans(msg: string, owner: string): Set<string> {
        const bans = new Set<string>();
        for(let i = 0; i< msg.length; ++i) {
            const size = this.checkBanRange(msg, i, owner);
            if(size > 0){
                bans.add(msg.substr(i,size))
                i += size - 1;
            }
        }
        return bans;
    }

    /**
     * 检测从当前点开始的敏感词长度
     * @param msg 检测文本
     * @param begin 开始位置
     * @param owner 房主昵称
     */
    private checkBanRange(msg: string, begin: number, owner: string): number {
        let match: IMatch = {size:0, end: false};
        let node: Map<string, any> = this._sensitiveMap.get('admin')|| new Map();
        const hasFirstChar = node.has(msg.charAt(begin).toLocaleLowerCase());

        let ownerMatch: IMatch = {size:0, end: false};
        let ownerNode: Map<string, any> = this._sensitiveMap.get(owner)||new Map();
        const ownerHasFirstChar = owner !== '' && ownerNode.has(msg.charAt(begin).toLocaleLowerCase());

        for(let i = begin; i < msg.length; ++i) {
            //当前循环的字符
            const char = msg.charAt(i).toLocaleLowerCase();
            let nodeHasChar = node && node.has(char) && !match.end
            if(hasFirstChar && (nodeHasChar || char === ' ')) {
                ++match.size;
                if(char !== ' ') {
                    node = node.get(char)
                    if(node.get(DFA_TAG.TAG) === DFA_TAG.END) match.end = true;
                }
            }
            nodeHasChar = ownerNode && ownerNode.has(char) && !ownerMatch.end;
            if(ownerHasFirstChar && (nodeHasChar || char === ' ')) {
                ++ownerMatch.size;
                if(char !== ' ') {
                    ownerNode = ownerNode.get(char);
                    if(ownerNode.get(DFA_TAG.TAG) === DFA_TAG.END) ownerMatch.end = true;
                }
            }
        }
        if(!match.end) match.size = 0;
        if(!ownerMatch.end) ownerMatch.size = 0;

        return Math.max(match.size, ownerMatch.size);
    }

    /**
     * 用火星文替换敏感词
     * @param msg 原始文本数据 
     * @param owner 房主昵称，用于检测自定义敏感词
     */
    replace(msg: string, owner: string = ''): string {
        const bans = [...this.getBans(msg, owner)];
        //log('敏感词检测',bans);
        return msg.replace(new RegExp(bans.join('|'),'ig'), (banword) => {
            const replaceChars = '@#$%&';
            return new Array(banword.length).fill(0).map(() => {
                return replaceChars.charAt(Math.random() * replaceChars.length);
            }).join('') 
        })
    }
}

/**
 * 敏感词DFA算啊
 */
export const dfa = new DFA();

export enum DFA_TAG {
    //默认索引
    DEFAULT,
    //结束点索引
    END,
    //索引字段
    TAG = 'isEnd'
}