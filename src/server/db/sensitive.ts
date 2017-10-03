import { checkout, restore } from './pool';
import { log, error } from "../../utils/log";

export class Sensitive {

    /**
     * 用户自定义的敏感词
     */
    private _rMap: Map<string, string[]> = new Map();
    /**
     * 全局通用的敏感词
     */
    private _cMap: string[] = [];

    constructor() {}

    /**
     * 主线程获取敏感词
     */
    async setup() {
        return await new Promise((res,rej) => {
            checkout(db => {
                db.collection('sensitive').find().toArray().then((all) => {
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

    get words(): string[] {
        return this._cMap;
    }

    vaild(msg: string): string {
        return msg.replace(new RegExp(this._cMap.join('|'),'ig'),(data) => {
            return '*'.repeat(data.length);
        })
    }
}

export default new Sensitive();