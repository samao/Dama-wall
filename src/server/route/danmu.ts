import * as express from "express";
import * as cluster from "cluster";
import { syncTransfer } from '../worker/syncTransfer';
import { Actions } from '../worker/actions';
import { roomParser } from "../lobby/roomParser";
import { log, error } from "../../utils/log";
import { checkout, restore } from "../db/pool";

const router = express.Router();

const info = {title:'弹幕墙HTTP发送端'}

router.use((req, res, next) => {
    //utf8编码
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    //禁止跨域调用
    //res.removeHeader('Access-Control-Allow-Origin');
    next();
})
router.route('/').all((req, res, next) => {
    res.end('请求链接不存在');
})

router.route('/:rid').all((req, res, next) => {
    roomParser(req.url).then(pathname => {
        log(`Http 房间地址 ${pathname}`);
        next();
    },reason => {
        error(reason);
        sendFailure(res, reason)
    }).catch(reason => {
        error(reason);
        sendFailure(res, reason);
    })
}).get((req, res, next) => {
    //渲染发送页面
    res.render('danmu',info);
}).post((req, res, next) => {
    roomParser(req.url).then(pathname => {
        if(req.body.message === 'fuck') {
            sendFailure(res, '敏感词');
            return;
        }
        syncTransfer({action: Actions.POST,data: req.body.message, pathname:`${req.params.rid}`});
        res.json({ok: true});
    },reason => {
        error(reason);
        sendFailure(res, reason)
    }).catch(reason => {
        error(reason);
        sendFailure(res, reason)
    });
})

router.route('/recive/:rid').post((req,res,next) => {
    syncTransfer({action: Actions.POST,data: req.body.message, pathname:`${req.params.rid}`});
})

function sendFailure(res:{json: (data: any) => any}, reason: string): void {
    res.json({ok:false, reason});
}

export default router;