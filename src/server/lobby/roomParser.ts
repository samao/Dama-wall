/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 10:29:05 
 * @Last Modified by:   iDzeir 
 * @Last Modified time: 2017-11-08 10:29:05 
 */

import * as url from 'url';

import { checkout, restore } from "../db/pool";
import { log, error } from "../../utils/log";
import { Collection } from "../db/collection";
/**
* 返回 ts Promise<any>
* @param path 用户连接的ws路径
*/
export function roomParser(path: string|undefined): Promise<{roomid: string, owner: string}>{
        return new Promise((res,rej) => {
            if(typeof path === 'undefined' || path === '/undefined'|| typeof path === 'string' && path.replace(/\//,'') === '') {
                setImmediate(rej,'please check your path');
                return;
            }
            let { roomid } = parserId(path);
            log('链接路径',path, roomid);
            if(roomid) {
                //检查路径
                checkout(db => {
                    db.collection(Collection.ACTIVITY).findOne({ rid:roomid }).then(data => {
                        if(data) {
                            setImmediate(res, {roomid: data.rid, owner: data.master})
                        }else{
                            rej(`不存在的活动id: ${roomid}`);
                        }
                    }, reason => {
                        rej(`读取活动 ${roomid} 错误 ${reason}`);
                    }).then(() => {
                        restore(db)
                    })
                },reason => {
                    rej(`无法链接数据库 ${reason}`)
                })
            }else{
                setImmediate(rej,'illegal path!!!')
            }
        }
    )
}

export function parserId(path: string): {roomid?: string} {
    let paths = url.parse(path);
    return {roomid: paths.pathname ? paths.pathname.slice(1) : undefined}
}
