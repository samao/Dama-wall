import {log, error} from '../log';
import whiteChars from './whiteChars';

//敏感词匹配数据
interface IMatch {
    size: number;
    end: boolean;
    block: boolean;
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

/** 敏感词匹配结果 */
interface IBadResult {
    /**
     * 输入字符串
     */
    input: string;
    /**
     * 输出字符串
     */
    out: string;
    /**
     * 包含敏感词组
     */
    badwords: string[];
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
                if(whiteChars.has(char)) continue;
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
    buildBadTree(banMap: Map<string,string[]>): void {
        for(const [owner, words] of banMap) {
            this.buildDFA(words, owner);
        }
    }

    /**
     * 添加一个敏感词到数据模型
     * @param word 敏感词
     * @param owner 房主昵称
     */
    addBadWord(words: string[], owner: string): void {
        this._sensitiveMap.delete(owner);
        words.length > 0 && words.forEach(word => {
            let node = this._sensitiveMap.get(owner);
            if(!node) {
                node = new Map<string, any>();
                this._sensitiveMap.set(owner, node);
            }
            for(const char of word) {
                if(whiteChars.has(char)) continue;
                if(!node.has(char)) {
                    let map: Map<string, any> = new Map();
                    map.set(DFA_TAG.TAG, DFA_TAG.DEFAULT)
                    node.set(char.toLocaleLowerCase(), map);
                }
                node = <Map<string, any>>node.get(char.toLocaleLowerCase())
            }
            node.set(DFA_TAG.TAG, DFA_TAG.END);
        })
    }

    /**
     * 从数据模型删除一个敏感词
     * @param word 敏感词
     * @param owner 房主昵称
     */
    removeBadWord(word: string, owner: string): void {
        
        let nodes: INode[] = [];
        
        let node = this._sensitiveMap.get(owner);
        if(node) {
            //查找敏感词节点
            for(const char of word) {
                if(whiteChars.has(char)) continue;
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
     * 创建脑残文字
     * @param len 返回内容长度
     */
    private createLeetSpeak(len: number): string {
        const chars = '@#$%&*^';
        let result = chars;
        if(len > chars.length)
            result += chars.repeat(len / chars.length);
        return result.slice(0, len);
    }

    /**
     * 从msg中解析敏感词
     * @param msg 消息
     * @param owner 房主
     */
    private getBads(msg: string, owner: string): {bans:Set<string>, out: string} {
        const bans = new Set<string>();
        let lastNoEmpty = '';
        let out = '';
        for(let i = 0; i< msg.length; ++i) {
            const char = msg.charAt(i);
            const size = this.checkBadRange(lastNoEmpty, msg, i, owner);
            //log('游标：'+ i + '步长：' +size)
            if(size > 0){
                const word = msg.substr(i, size);
                //log('敏感词:'+word);
                bans.add(word)
                out += this.createLeetSpeak(word.length);
                i += size - 1;
            }else{
                out += char;
            }
            if(!whiteChars.has(char)) lastNoEmpty = char;
        }
        return {bans,out};
    }

    /**
     * 检测从当前点开始的敏感词长度
     * @param lastNoEmpty begin位置前一个不为空字符串的字符
     * @param msg 检测文本
     * @param begin 开始位置
     * @param owner 房主昵称
     */
    private checkBadRange(lastNoEmpty: string, msg: string, begin: number, owner: string): number {
        let match: IMatch = {size:0, end: false, block: false};
        let node: Map<string, any> = this._sensitiveMap.get('admin') || new Map();
        const hasFirstChar = node.has(msg.charAt(begin).toLocaleLowerCase());

        let ownerMatch: IMatch = {size:0, end: false, block: false};
        let ownerNode: Map<string, any> = this._sensitiveMap.get(owner) ||new Map();
        const ownerHasFirstChar = owner !== '' && ownerNode.has(msg.charAt(begin).toLocaleLowerCase());

        if(!hasFirstChar && !ownerHasFirstChar) return 0;

        //log('匹配开始',begin, hasFirstChar)
        for(let i = begin; i < msg.length; ++i) {
            const char = msg.charAt(i).toLocaleLowerCase();

            //多个空格前的字符是否为单字符
            const isByteChar = i == 0 ? true : Buffer.byteLength(lastNoEmpty) === 1 && !whiteChars.has(lastNoEmpty);

            if(hasFirstChar && !match.end && !match.block) {
                const hasChar = node && node.has(char);
                if(hasChar) {
                    ++match.size;
                    node = node.get(char)
                    if(node.get(DFA_TAG.TAG) === DFA_TAG.END) match.end = true;
                }else if(whiteChars.has(char) && isByteChar) {
                    match.block = true;
                }else {
                    ++match.size;
                    if(!hasChar && !whiteChars.has(char)) match.block = true;
                }
                //log(`当前字符${lastNoEmpty}->${char} 匹配长度:[${match.size}] 节点:[${hasChar}] 是否前单节:[${isByteChar}] 结果:[${match.end}]`)
            }
            //只有通用敏感词退出循环
            if(hasFirstChar && !ownerHasFirstChar && match.end) { break }
            
            if(ownerHasFirstChar && !ownerMatch.end && !ownerMatch.block) {
                const hasChar = ownerNode && ownerNode.has(char);
                if(hasChar) {
                    ++ownerMatch.size;
                    ownerNode = ownerNode.get(char);
                    if(ownerNode.get(DFA_TAG.TAG) === DFA_TAG.END) ownerMatch.end = true;
                }else if(whiteChars.has(char) && isByteChar) {
                    ownerMatch.block = true;
                }else {
                    ++ownerMatch.size;
                    if(!ownerNode.has(char) && !whiteChars.has(char)) ownerMatch.block = true;
                }
            }
            //只有自定义敏感词提前退出循环
            if(!hasFirstChar && ownerHasFirstChar && ownerMatch.end) { break }
            //全部节点结束退出循环
            if(match.end && ownerMatch.end) { break }

            if(!whiteChars.has(char)) lastNoEmpty = char;
        }
        if(!match.end) match.size = 0;
        if(!ownerMatch.end) ownerMatch.size = 0;

        return Math.max(match.size, ownerMatch.size);
    }

    /**
     * 用火星文替换敏感词
     * @param input 原始文本数据 
     * @param owner 房主昵称，用于检测自定义敏感词
     */
    replace(input: string, owner: string = ''): IBadResult {
        const { bans, out } = this.getBads(input, owner)
        return {badwords: [...bans], out, input};
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