import * as express from "express";
import * as cluster from "cluster";
import { syncTransfer } from '../worker/syncTransfer';
import { Actions } from '../worker/actions';
import { roomParser } from "../lobby/roomParser";
import { log, error } from "../../utils/log";

const router = express.Router();

const info = {title:'弹幕墙HTTP发送端'}

router.use((req, res, next) => {
    //utf8编码
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    //禁止跨域调用
    res.removeHeader('Access-Control-Allow-Origin');
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
        res.end(`发送链接错误 ${req.url}, ${reason}`);
    }).catch(reason => {
        res.end(`发送链接错误 ${req.url}, ${reason}`);
    })
}).get((req, res, next) => {
    res.render('danmu',info);
}).post((req, res, next) => {
    res.render('danmu',{...info, ...{ok: true}});
    syncTransfer({action: Actions.POST,data: req.body.message, pathname:`/${req.params.rid}`});
})

export default router;