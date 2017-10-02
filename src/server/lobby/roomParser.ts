import * as url from 'url';
import { checkout, restore } from "../db/pool";
import { log, error } from "../../utils/log";
/**
* 返回 ts Promise<any>
* @param path 用户连接的ws路径
*/
export function roomParser(path: string|undefined): Promise<string>{
        return new Promise((res,rej) => {
            if(typeof path === 'undefined' || path === '/undefined'|| typeof path === 'string' && path.replace(/\//,'') === '') {
                setImmediate(rej,'please check your path');
                return;
            }
            let {pathname} = url.parse(path);
            if(pathname) {
                let rid = +pathname.slice(1);
                //检查路径
                checkout(db => {
                    db.collection('activity').findOne({rid}).then(data => {
                        log(JSON.stringify(data));
                        if(data) {
                            setImmediate(res,pathname)
                        }else{
                            rej(`不存在的活动id: ${rid}`);
                        }
                    }, reason => {
                        rej(`读取活动 ${rid} 错误 ${reason}`);
                    }).then(() => {
                        restore(db)
                    })
                },reason => {
                    rej(`无法链接数据库 ${reason}`)
                })
            }else{
                setImmediate(rej,'illegal path!!!')
            }
        })
    }