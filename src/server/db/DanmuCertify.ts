import { checkout, restore } from './pool';
import { log, error } from "../../utils/log";
import { Collection } from "./collection";

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
    async setup() {
        return await new Promise((res,rej) => {
            checkout(db => {
                db.collection(Collection.SENSITIVE).find().toArray().then((all) => {
                    this._cMap.push(...all.map(data => data.words))
                    res()
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

    toolong(msg: string): boolean {
        return msg.length > MAX_MESSAGE_LENGTH;
    }
}

export default new DanmuCertify();