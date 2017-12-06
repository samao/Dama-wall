/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 10:25:29 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2017-11-16 15:05:40
 */
import * as cluster from 'cluster';
import * as express from "express";
import * as QRCode from "qrcode";
import * as path from 'path';

import { checkout, restore, insert, IActivityDB, getAutoKey } from "../db/pool";
import { Collection } from "../db/collection";
import { log, error } from "../../utils/log";
import { HOST, ports } from "../config/conf";
import { success, failure } from "../../utils/feedback";
import { dfa } from '../../utils/dfa/DFA';
import { syncTransfer } from '../worker/syncTransfer';
import { WordActions } from '../worker/actions';

/**
 * 线程敏感词消息体
 */
interface IWordData {
    owner: string;
    word: string;
    [index: string]: any;
}

const router = express.Router();

//用户信息修改
router.route('/user/:uid').post((req, res, next) => {
    checkout(db => {
        const users = db.collection(Collection.USER);
        users.findOneAndUpdate({_id: +req.params.uid}, {$set: { isAdmin: req.body.checked === 'true' }}, (err, result) => {
            if(err) {
                error('写入更新失败',err)
            }else{
                success(res, '更新用户信息成功')
            }
            restore(db);
        })
    }, reason => failure(res, `user 接口无法连接数据库`))
}).delete((req, res, next) => {
    checkout(db => {
        const users = db.collection(Collection.USER);
        users.remove({_id: +req.params.uid}).then(data => {
            success(res, '删除成功')
        }).catch(reason => failure(res, `无法删除用户 ${reason}`)).then(() => restore(db));
    }, reason => failure(res, `数据库连接失败无法删除用户`))
})

//活动数据接口
router.route('/activity/:rid').all((req, res,next) => {
    //分权限
    log(`本次rid: ${req.params.rid}`)
    next();
}).post((req, res, next) => {
    //新建活动
    createAct(req, res);
}).delete((req, res, next) => {
    //删除活动
    deleteAct(req, res);
}).patch((req, res, next) => {
    //更新活动
    res.end('更新活动信息');
})

//导航接口
router.route('/nav').patch((req, res, next) => {
    const id = +req.body.id;
    const checked = req.body.checked === 'true';
    checkout(db => {
        const pages = db.collection(Collection.PAGES);
        pages.findOneAndUpdate({id},{$set: {active: checked}}).then(() => {
            success(res, '调用成功')
        }).catch(reason => failure(res, `更新导航数据失败 ${reason}`)).then(() => restore(db))
    }, reason => failure(res, `无法连接数据库 ${reason}`))
})

//敏感词接口
router.route('/word').all((req, res, next) => {
    const word = req.body.word;
    if(!word || word === '' || Object.is(word, undefined) || Object.is(word,null)) {
        failure(res, `无效参数`);
        return;
    }
    next();
}).post((req, res, next) => {
    checkout(db => {
        const owner = res.locals.loginUser.user
        const word = req.body.word;
        const words = db.collection(Collection.SENSITIVE);
        words.insert({word, owner}).then(() => {
            success(res, '写入敏感词成功');
            wordAction(WordActions.POST, {word, owner});
        }).catch(reason => failure(res, `插入数据库失败 ${reason}`)).then(() => restore(db));
    },reason => failure(res, `无法连接数据库 ${reason}`))
}).delete((req, res, next) => {
    checkout(db => {
        const owner = res.locals.loginUser.user;
        const word = req.body.word;
        const words = db.collection(Collection.SENSITIVE);
        words.findOneAndDelete({word, owner}).then(() => {
            success(res,`删除成功 ${word}`);
            wordAction(WordActions.DELETE, {word, owner});
        }).catch(reason => failure(res, `删除敏感词失败 ${reason}`)).then(() => restore(db));
    }, reason => failure(res, `无法连接数据库 ${reason}`))
})

//表情接口
router.route('/emotions').get((req, res, next) => {
    checkout(db => {
        const emotions = db.collection(Collection.EMOTION);
        emotions.find({},{_id:0,tag:1,url:1}).toArray().then(data => {
            success(res,data);
        }).catch(reason => failure(res, `读取表情数据失败: ${reason}`)).then(() => restore(db));
    },reason => failure(res, `获取表情失败:${reason}`))
})

/**
 * 线程间同步敏感词消息
 * @param action 线程同步action
 * @param data 线程数据
 */
function wordAction(action: WordActions, data: IWordData): void {
    const {word, owner} = data;
    switch(action) {
        case WordActions.POST:
            dfa.addBadWord(word, owner)
        break;
        case WordActions.DELETE:
            dfa.removeBadWord(word, owner);
        break;
    }
    syncTransfer({action,data}, cluster.worker);
}

/**
 * 生成活动二维码
 * @param req 
 * @param res 
 */
function createAct(req:IRequest, res:IRespond): void {
    //1.活动写入数据库
    checkout(db => {
        const actTable = db.collection(Collection.ACTIVITY)
        getAutoKey(Collection.ACTIVITY).then(_id => {
            const master = res.locals.loginUser.user;
            const {title = '未指定', description = '未指定'} = req.body;
            insert<IActivityDB>(actTable,{
                _id, 
                rid: req.params.rid, 
                title, 
                description,
                master,
                created:new Date()
            }).then(() => {
                log('活动信息成功写入数据库')
                //2.生成二维码文件
                const QRPath = path.resolve('public','images','qr',`${req.params.rid}.png`);
                const QRData = `${HOST}:${ports.web}/danmu/${req.params.rid}`;
                
                log('二维码存储地址',QRPath);
                log('二维码内容',QRData);
    
                QRCode.toFile(QRPath, QRData, err => {
                    if(err)
                        failure(res, `生成二维码失败 ${err.message}`);
                    else
                        success(res, `${HOST}:${ports.web}/qr/${req.params.rid}`);
                });
            },({errmsg:reason}) => {
                failure(res, `活动名称已经存在 ${req.params.rid}`)
            }).then(() => {
                restore(db);
            });
        }, reason => failure(res, `获取id生成错误 ${reason}`))
    }, reason => {
        failure(res, `无法连接数据库 ${req.params.rid}`)
    })
}

function deleteAct(req:IRequest, res:IRespond): void {
    //1.删除活动数据库
    checkout(db => {
        db.collection(Collection.ACTIVITY).deleteOne({rid: req.params.rid}).then(() => {
            //活动删除成功
            success(res);
        }, reason => {
            failure(res, `删除活动失败 ${reason}`)
        }).then(() => restore(db));
    }, reason => {
        failure(res, `无法连接数据库 ${req.params.rid}`)
    })
}

function patchAct(): void {
    //1.更新活动数据库
}

export default router;