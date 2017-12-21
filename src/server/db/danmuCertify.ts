/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 10:28:35 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2017-12-17 13:44:27
 */

import * as WebSocket from 'ws';
import { Db } from "mongodb";

import { checkout, restore } from './pool';
import { log, error } from "../../utils/log";
import { Collection } from "./collection";
import { call, remove } from "../../utils/ticker";
import { dfa } from '../../utils/dfa/DFA';
import { Error } from '../error/error';

interface IBanedWord {
    word: string;
    owner: string;
}

export const MAX_MESSAGE_LENGTH = 30;

export class DanmuCertify {
    /**
     * 敏感词
     */
    private _cMap: Map<string, string[]> = new Map();

    private _regExp: RegExp;
    private _emotions: {tag: string}[];

    constructor() {}

    async init(db: Db) {
        let emotions = db.collection(Collection.EMOTION).find({active:true},{_id: 0, tag: 1}).toArray();
        let badwords = db.collection(Collection.SENSITIVE).find({}, {_id:0}).toArray();

        return await Promise.all([emotions, badwords])
    }
    /**
     * 主线程获取敏感词
     */
    setup(): Promise<{emotions:any[],badwords:any[]}> {
        return new Promise((res,rej) => {
            checkout(db => {
                this.init(db).then(([emotions, badwords]) => {
                    this.groupBans(badwords);
                    this.regExp = emotions;
                    res({emotions, badwords})
                }).catch(reason => {
                    error(`${Error.DB_READ}: ${reason}`)
                    rej(reason);
                }).then(() => restore(db));
            }, reason => {
                error(`${Error.DB_CONNECT}: ${reason}`)
            })
        })
    }

    groupBans(words:IBanedWord[]):void {
        this._cMap.clear();
        for(const {word, owner} of words) {
            const userBans = this._cMap.get(owner) || [];
            userBans.push(word);
            this._cMap.set(owner, userBans);
        }
        dfa.buildBadTree(this._cMap);


        //全部通用敏感词过滤测试
        /*
        const content = JSON.stringify(this._cMap.get('admin')).slice(0,2000);
        const now = Date.now();
        const result = this.filter(content);
        log(`DFA检测 ${content.length} 字符,发现敏感词: ${result.badwords.length} 个,耗时: ${Date.now() - now}`)*/
    }

    /** 初始化表情数据 */
    set regExp(emotions:{tag:string}[]) {
        const _tagMap: string[] = [];
		emotions && emotions.forEach(({tag}) =>
		{
			_tagMap.push(tag.replace(/\[(.+)\]/ig,'(\\[$1\\])'));
		});
        this._regExp = new RegExp(_tagMap.join('|'),'ig');
        this._emotions = emotions;
    }

    get emotions(): {tag: string}[] {
        return this._emotions;
    }

    get systemWords(): string[] {
        return this._cMap.get('admin')||[]
    }

    /**
     * 从主线程获取敏感词
     * @param words 子线程环境变量中传入的敏感词
     */
    setupFromMaster({emotions, badwords: words}: {emotions: {tag:string}[], badwords:IBanedWord[]}): void {
        this.groupBans(words);
        this.regExp = emotions;
    }

    /**
     * 敏感词替换为*号输出
     * @param msg 源字符串
     */
    filter(msg: string, roomMaster: string = ''): {badwords: string[] ,out: string} {
        //用户设定敏感词和通用敏感词匹配
        return dfa.replace(msg, roomMaster);
    }

    addBan(word: string, owner: string): void {
        const userBans = this._cMap.get(owner) || [];
        userBans.push(word);
        this._cMap.set(owner, userBans);
        dfa.addBadWord(word, owner);
    }

    removeBan(word: string, owner: string): void {
        const userBans = this._cMap.get(owner) || [];
        if(userBans.includes(word)){
            userBans.splice(userBans.indexOf(word), 1)
            dfa.removeBadWord(word, owner);
        }
    }

    /**
     * 弹幕内容过长,一个表情3个字符
     * @param msg 弹幕内容
     */
    toolong(msg: string): boolean {
        return msg.replace(this._regExp,'AAAAA').length > MAX_MESSAGE_LENGTH;
    }
    /**
     * 发送弹幕来源是否在cd中
     * @param user 弹幕来源
     */
    inCD(user: string|WebSocket): boolean {
        if(danmuUsers.has(user)) return true;
        danmuUsers.set(user, {left: COOL_DOWN, last: Date.now()})
        runCooldownTicker();
        return false;
    }
}

//发送弹幕冷却时间
export const COOL_DOWN = 3000;
//冷却中的用户
const danmuUsers: Map<string|WebSocket, {left: number, last: number}> = new Map();
//计时器是否在运行
let running = false;
//计时器id
let checkid:Symbol;

function runCooldownTicker():void {
    if(!running) {
        running = true;
        checkid = call(() => {
            const now = Date.now();
            for(let [key, {left, last}] of danmuUsers) {
                const duration = now - last;
                const remain = left - duration;
                if(remain <= 0) {
                    danmuUsers.delete(key);
                }else{
                    danmuUsers.set(key, {left: remain, last:now})
                }
            }
            if(danmuUsers.size == 0) {
                remove(checkid);
                running = false;
            }
        }, COOL_DOWN)
    }
}

export default new DanmuCertify();