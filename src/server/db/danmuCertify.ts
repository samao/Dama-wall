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

export const MAX_MESSAGE_LENGTH = 30;

export class DanmuCertify {

    /**
     * 用户自定义的敏感词
     */
    private _rMap: Map<string, string[]> = new Map();
    /**
     * 全局通用的敏感词
     */
    private _cMap: string[] = [];
    /**
     * 全局敏感词正则
     */
    private _cReg: RegExp;

    constructor() {}

    /**
     * 主线程获取敏感词
     */
    setup(): Promise<string[]> {
        return new Promise((res,rej) => {
            checkout(db => {
                db.collection(Collection.SENSITIVE).find({},{_id:0}).toArray().then((all) => {
                    this._cMap.push(...all.map(data => data.words))
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

    /**
     * 从主线程获取敏感词
     * @param words 子线程环境变量中传入的敏感词
     */
    setupFromMaster(words: string): void {
        this._cMap.length = 0;
        this._cMap.push(...words.split(','));
    }

    /**
     * 弹幕敏感词
     */
    get words(): string[] {
        return this._cMap;
    }

    /**
     * 敏感词替换为*号输出
     * @param msg 源字符串
     */
    filter(msg: string): string {
        if(!this._cReg) {
            this._cReg = new RegExp(this._cMap.join('|'),'ig');
        }
        return msg.replace(this._cReg,(data) => {
            return '*'.repeat(data.length);
        })
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