import * as express from "express";
import * as cluster from "cluster";

import { syncTransfer } from '../worker/syncTransfer';
import { Actions } from '../worker/actions';
import { roomParser } from "../lobby/roomParser";
import { log, error } from "../../utils/log";
import { checkout, restore } from "../db/pool";
import { default as sensitive } from "../db/sensitive";

const router = express.Router();

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
    //房间验证
    roomParser(req.url).then(pathname => {
        log(`Http 房间地址 ${pathname}`);
        next();
    },reason => {
        error(reason);
        responseFailure(res, reason)
    }).catch(reason => {
        error(reason);
        responseFailure(res, reason);
    })
}).get((req, res, next) => {
    //渲染发送页面
    res.render('danmu', {title:'弹幕墙HTTP发送端'});
}).post((req, res, next) => {
    //弹幕数据处理
    roomParser(req.url).then(pathname => {
        //加工敏感词
        req.body.message = sensitive.parse(req.body.message);
        //回复用户
        res.json({ok: true, message: req.body.message});
        //同步线程消息
        syncTransfer({action: Actions.POST,data: req.body.message, pathname:`${req.params.rid}`});
    },reason => {
        responseFailure(res, reason)
    }).catch(reason => {
        responseFailure(res, reason)
    });
})
/**
 * 接口调用错误反馈
 * @param res 
 * @param reason 错误原因
 */
function responseFailure(res:{json: (data: any) => any}, reason: string): void {
    error(reason);
    res.json({ok:false, reason});
}

export default router;