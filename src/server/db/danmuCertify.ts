/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 10:28:35 
 * @Last Modified by:   iDzeir 
 * @Last Modified time: 2017-11-08 10:28:35 
 */

import * as WebSocket from 'ws';

import { checkout, restore } from './pool';
import { log, error } from "../../utils/log";
import { Collection } from "./collection";
import { call, remove } from "../../utils/ticker";
import { sensitiveMap, buildDFA, DFA_TAG } from './DFA';

interface IBanedWord {
    word: string;
    owner: string;
}

export const MAX_MESSAGE_LENGTH = 30;

export class DanmuCertify {

    /**
     * 用户自定义的敏感词
     */
    private _rMap: Map<string, string[]> = new Map();
    /**
     * 全局通用的敏感词
     */
    private _cMap: IBanedWord[] = [];

    constructor() {}

    getBansByUser(owner: string): string[] {
        const userBans = this._rMap.get(owner)||[];
        if(!this._rMap.has(owner))
            this._rMap.set(owner, userBans);
        return userBans;
    }

    /**
     * 主线程获取敏感词
     */
    setup(): Promise<IBanedWord[]> {
        return new Promise((res,rej) => {
            checkout(db => {
                db.collection(Collection.SENSITIVE).find({},{_id:0}).toArray().then((all) => {
                    this.groupBans(all);
                    res(this.words)
                },reason => {
                    error(reason)
                }).then(() => {
                    restore(db);
                })
            }, reason => {
                error(`获取全局敏感词失败 ${reason}`)
            })
        })
    }

    groupBans(words:IBanedWord[]):void {
        this._cMap.length = 0;
        this._cMap.push(...words);
        this._rMap.clear();
        this._cMap.forEach(({word, owner}) => {
            this.getBansByUser(owner).push(word)
        })
        buildDFA(this.getBansByUser('admin'));
    }

    /**
     * 从主线程获取敏感词
     * @param words 子线程环境变量中传入的敏感词
     */
    setupFromMaster(words: IBanedWord[]): void {
        this.groupBans(words);
    }

    addBan(word: string, optUser: string): void {
        this._cMap.push({word, owner: optUser})
    }
    /**
     * admin 管理员设置的系统敏感词
     */
    get systemWords(): IBanedWord[] {
        return this._cMap.filter(e => e.owner === 'admin')
    }

    /**
     * 弹幕敏感词
     */
    get words(): IBanedWord[] {
        return this._cMap;
    }

    getAllBansOfUser(owner: string): string[] {
        const bans = this.getBansByUser('admin').concat();
        return bans.concat(this.getBansByUser(owner));
    }

    /**
     * 敏感词替换为*号输出
     * @param msg 源字符串
     */
    filter(msg: string, roomMaster: string = ''): string {
        //用户设定敏感词和通用敏感词匹配
        const _cReg = new RegExp(this.getAllBansOfUser(roomMaster).join('|'),'ig');
        console.log(_cReg)
        return msg.replace(_cReg, '*');
        /*
        return msg.replace(_cReg,(data) => {
            return '*'.repeat(data.length);
        })*/
    }

    /**
     * 弹幕内容过长
     * @param msg 弹幕内容
     */
    toolong(msg: string): boolean {
        return msg.length > MAX_MESSAGE_LENGTH;
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