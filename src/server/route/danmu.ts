import * as express from "express";
import * as cluster from "cluster";

import danmuCertify, { MAX_MESSAGE_LENGTH } from "../db/danmuCertify";

import { syncTransfer } from '../worker/syncTransfer';
import { Actions } from '../worker/actions';
import { roomParser } from "../lobby/roomParser";
import { log, error } from "../../utils/log";
import { checkout, restore } from "../db/pool";
import { Collection } from "../db/collection";
import { cache, get } from "../../utils/caches";
import { failure, success } from "../../utils/feedback";

const router = express.Router();

interface IEmoj {
    /** 标识*/
    tag: string;
    /** 表情连接*/
    url: string;
}
/** 缓存数据的标识 */
let syEmoj: Symbol;

router.use((req, res, next) => {
    //utf8编码
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    //禁止跨域调用
    res.setHeader('Access-Control-Allow-Origin', '*');
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
        failure(res, reason)
    }).catch(reason => {
        failure(res, reason);
    })
}).get((req, res, next) => {
    //渲染发送页面
    if(!syEmoj) {
        checkout(db => {
            db.collection(Collection.EMOTION).find({active:true}).sort({key:1}).toArray().then(data => {
                if(data){
                    syEmoj = cache(data)
                    res.render('danmu', {title:'弹幕墙HTTP发送端', emojMap: get<IEmoj[]>(syEmoj)});
                }else{
                    failure(res, '没有表情数据')
                }
            }, reason => {
                failure(res, reason);
            })
        }, reason => {
            failure(res, reason);
        })
    }else{
        res.render('danmu', {title:'弹幕墙HTTP发送端', emojMap: get<IEmoj[]>(syEmoj)});
    }   
}).post((req, res, next) => {
    //弹幕数据处理
    roomParser(req.url).then(pathname => {
        if(danmuCertify.toolong(req.body.message)) {
            failure(res, `发送弹幕内容过长,不能超过${MAX_MESSAGE_LENGTH}`);
            return;
        }
        //加工敏感词
        req.body.message = danmuCertify.filter(req.body.message);
        //回复用户
        success(res, req.body.message)
        //同步线程消息
        syncTransfer({action: Actions.POST,data: req.body.message, pathname:`${req.params.rid}`});
    },reason => {
        failure(res, reason)
    }).catch(reason => {
        failure(res, reason)
    });
})

export default router;