import { Board } from '../config/conf';
import { Collection } from '../db/collection';
import { checkout, restore } from '../db/pool';
import { log, error } from "../../utils/log";
import danmuCertify from "../db/danmuCertify";

//后台board 数据获取map
const obtainsMap: Map<string, (reset?: any) => Promise<any>> = new Map([
    [Board.WELCOME, () => Promise.resolve({title:`欢迎页面 ${Board.WELCOME}`})],
    [Board.NAV, obtainPages],
    [Board.ACTI, obtainActivity],
    [Board.EMOTION, obtainEmotions],
    [Board.USER, obtainUsers],
    [Board.FILTER, obtainFilters]
]);

/**
 * 获取版子数据promise
 * @param board 版子名称
 */
export async function obtain(board: string): Promise<any> {
    const handler = obtainsMap.get(board);
    if(handler) {
        return await handler();
    }else{
        return Promise.resolve({title:board});
    }
}

/**
 * 获取敏感词
 */
function obtainFilters(): Promise<any> {
    return Promise.resolve({words: danmuCertify.words});
}

/**
 * 获取用户
 */
function obtainUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
        checkout(db => {
            const users = db.collection(Collection.USER);
            users.find().limit(20).toArray().then(data => {
                resolve({users:data});
            }).catch(reject)
        }, reason => reject(reason));
    })
}

/**
 * 获取页面导航
 */
function obtainPages(): Promise<any> {
    return new Promise((resolve, reject) => {
        checkout(db => {
            const pages = db.collection(Collection.PAGES);
            pages.find({},{_id:0}).toArray().then(data => {
                resolve({pages:data})
            }).catch(reject)
        }, reason => reject(reason));
    })
}

/**
 * 获取表情
 */
function obtainEmotions(): Promise<any> {
    return new Promise((resolve, reject) => {
        checkout(db => {
            const emotions = db.collection(Collection.EMOTION);
            emotions.find({},{_id:0}).limit(15).toArray().then(data => {
                resolve({list: data})
            }).catch(reject);
        }, reason => reject(reason))
    })
}
/**
 * 获取获取数据
 */
function obtainActivity({pageNo = 1, size = 50} = {}): Promise<any> {
    return new Promise((resolve, reject) => {
        checkout(db => {
            const actiCollection = db.collection(Collection.ACTIVITY);
            actiCollection.find({},{created:0}).limit(size).toArray().then(data => {
                log('活动数据',JSON.stringify(data))
                resolve({list:data})
            }).catch(reject)
        },reason => reject(reason))
    })
}