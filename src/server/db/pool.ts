import { MongoClient as mongo, Db } from "mongodb";
import { log, error } from '../../utils/log';
import { ports } from '../config/conf';
import { call, remove } from "../../utils/ticker";
import { Collection } from "./collection";

import { promisify } from "util";

//=======类型定义========

/**
 * 空闲连接结构
 */
interface IdleConnector {
    db: Db;
    delay: number;
}

export interface IUserDB {
    name: string;
    pwd: string;
}
//集合接口
interface ICollection {
    insert(data:any): Promise<any>
}
//原始数据类型别名
type DataType<T> = {
    [key in keyof T]: T[key]
}
//任意扩展类型别名
type AnyType = {
    [index:string]: any;
}

//=======功能代码========

const DB_NAME = 'dama'
const dburl = `mongodb://localhost:${ports.db}/${DB_NAME}`;
/**
 * db 空闲连接 关闭延迟
 */
const DELAY = 30000;

const CHECK = 5000;

const idleMap: IdleConnector[] = [];

/**
 * 强制数据匹配数据库模板
 * @param collection 集合
 * @param data 保存数据
 */
export function insert<T>(collection:ICollection, data: DataType<T> & AnyType): Promise<any> {
    return collection.insert(data);
}

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
 * 建立mongodb 索引
 */
export async function setupUnique() {
    let db = await connect();
    //用户集合索引
    let userIndexPromise = db.collection(Collection.USER).createIndex({name: 1}, {unique: true});
    //活动集合索引
    let activityIndexPromise = db.collection(Collection.ACTIVITY).createIndex({rid: 1}, {unique: true});
    //表情集合索引
    let emotionIndexPromise = db.collection(Collection.EMOTION).createIndex({tag: 1, url: 1}, {unique: true});
    //敏感词库索引
    let filterIndexPromise = db.collection(Collection.SENSITIVE).createIndex({words: 1}, {unique: true});

    return await Promise.all([
            userIndexPromise,
            activityIndexPromise,
            emotionIndexPromise,
            filterIndexPromise
        ]).then(indexes => {
            restore(db);
            return indexes;
        })
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