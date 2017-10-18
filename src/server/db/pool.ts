import { MongoClient as mongo, Db } from "mongodb";
import { log, error } from '../../utils/Log';
import { ports } from '../config/conf';
import { call, remove } from "../../utils/Ticker";

import { promisify } from "util";

const DB_NAME = 'dama'
const dburl = `mongodb://localhost:${ports.db}/${DB_NAME}`;
/**
 * db 空闲连接 关闭延迟
 */
const DELAY = 30000;

const CHECK = 5000;

/**
 * 空闲连接结构
 */
interface IdleConnector {
    db: Db;
    delay: number;
}

const idleMap: IdleConnector[] = [];

async function connect() {
    return await promisify(mongo.connect)(dburl, {});
}

/**
 * 获取一个已连接的db
 * @param resolve 成功获取连接
 * @param reject 建立连接失败
 */
function checkout(resolve: (db: Db) => any, reject?: (reason: any) => any): void {
    if(idleMap.length > 0) {
        let idle = idleMap.shift()
        if(idle) {
            log('重复利用db连接')
            resolve(idle.db);
            return;
        }
    }
    log('新建db连接');
    connect().then(resolve,reject)
}

/**
 * 空闲db连接返回对象池
 * @param db db连接
 */
function restore(db: Db): void {
    log('搁置空闲连接');
    idleMap.push({db, delay: DELAY});
}

function clear(): void {
    //超时需要清理的连接
    let map: Map<IdleConnector, Db> = new Map();
    for(const idle of idleMap) {
        if(idle.delay <= CHECK) {
            map.set(idle,idle.db);
            continue;
        }
        idle.delay -= CHECK;
    }

    if(map.size > 0) log('长时间空闲DB连接关闭')
    for(let [idle,db] of map) {
        db.close(true);
        idleMap.splice(idleMap.indexOf(idle), 1);
    }
}

call(clear, CHECK);

export {checkout, restore}