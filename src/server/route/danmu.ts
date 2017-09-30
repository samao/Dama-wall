import * as express from "express";
import * as cluster from "cluster";
import { syncTransfer } from '../worker/syncTransfer';
import { Actions } from '../worker/actions';

const router = express.Router();

router.route('/:rid').get((req, res, next) => {
    res.render('danmu',{title:'弹幕发送端'})
}).post((req, res, next) => {
    res.render('danmu',{title:'弹幕发送端',ok:true});
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