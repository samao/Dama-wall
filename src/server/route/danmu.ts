import * as express from "express";
import * as cluster from "cluster";
import { syncTransfer } from '../worker/syncTransfer';
import { Actions } from '../worker/actions';
import { roomParser } from "../lobby/roomParser";
import { log, error } from "../../utils/log";

const router = express.Router();

const info = {title:'弹幕墙HTTP发送端'}

router.route('/:rid').all((req, res, next) => {
    roomParser(req.url).then(pathname => {
        log(`Http 房间地址 ${pathname}`);
        next();
    },reason => {
        res.json(`发送链接错误 ${req.url}`);
    }).catch(reason => {
        res.json(`发送链接错误 ${req.url}`);
    })
}).get((req, res, next) => {
    res.render('danmu',info);
}).post((req, res, next) => {
    res.render('danmu',{...info, ...{ok: true}});
    if(cluster.isMaster) {
        for(let id of Reflect.ownKeys(cluster.workers)) {
            broadcast(cluster.workers[id], Actions.POST, req.params.rid, req.body.message)
        }
    }
})

/**
 * http聊天信息广播
 * @param worker 发送到得工作线程
 * @param action 发送聊天的action
 * @param pathname 房间号
 * @param data 发送的数据
 */
function broadcast(worker: cluster.Worker|undefined, action: Actions.POST, pathname: string, data:any): void {
    worker && worker.send({action,data,pathname:`/${pathname}`});
}

export default router;