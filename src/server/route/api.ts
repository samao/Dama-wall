/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 10:25:29 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2017-12-14 17:35:00
 */
import * as cluster from 'cluster';
import * as express from "express";
import * as QRCode from "qrcode";
import * as path from 'path';
import * as md5 from 'md5';
import { Db } from 'mongodb'

import uuid from '../../utils/uuid';
import { checkout, restore, insert, IActivityDB, getAutoKey } from "../db/pool";
import { Collection } from "../db/collection";
import { log, error } from "../../utils/log";
import { HOST, ports } from "../config/conf";
import { success, failure } from "../../utils/feedback";
import { dfa } from '../../utils/dfa/DFA';
import { syncTransfer } from '../worker/syncTransfer';
import { WordActions } from '../worker/actions';
import { call, remove, has } from '../../utils/ticker';
import { Error } from '../error/error';
import { secret } from '../config/conf';

/**
 * 线程敏感词消息体
 */
interface IWordData {
    owner: string;
    word: string[];
    [index: string]: any;
}

const router = express.Router();
//用户请求活动token
const tokenMap = new Map<string, number>();

let tokenTicker:Symbol;

//用户信息修改
router.route('/user/:uid').post((req, res, next) => {
    checkout(db => {
        const users = db.collection(Collection.USER);
        users.findOneAndUpdate({_id: +req.params.uid}, {$set: { isAdmin: req.body.checked === 'true' }}, (err, result) => {
            if(err) {
                failure(res, `${Error.DB_WRITE}:${err.message}`)
            }else{
                success(res, '更新用户信息成功')
            }
            restore(db);
        })
    }, reason => failure(res, `${Error.DB_CONNECT}: ${reason}`))
}).delete((req, res, next) => {
    checkout(db => {
        const users = db.collection(Collection.USER);
        users.remove({_id: +req.params.uid}).then(data => {
            success(res, '删除成功')
        }).catch(reason => failure(res, `${Error.DB_WRITE}:${reason}`)).then(() => restore(db));
    }, reason => failure(res, `${Error.DB_CONNECT}: ${reason}`))
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

//生成用户名密码关联的token用于客户端之后的连接会话
router.route('/token/:uid').post((req, res, next) => {
    checkout(db => {
        const users = db.collection(Collection.USER);
        log('token:',req.params.uid, req.body.pwd);
        users.count({name: req.params.uid, pwd: md5(req.body.pwd + secret)}).then(total => {
            if(total === 0)
                failure(res, Error.INCORRECT_USER_PASSWORD);
            else
                success(res,createToken());
        }).catch(reason => failure(res, `${Error.DB_READ}: ${reason}`)).then(() => restore(db));
    }, reason => failure(res,`${Error.DB_CONNECT}: ${reason}`))
})

//获取用户创建的所有活动
router.route('/activities/:uid/:token').get((req,res,next) => {
    if(!tokenMap.has(req.params.token)) {
        failure(res, Error.INCORRECT_ARGUMENTS);
        return;
    }
    checkout(db => {
        const users = db.collection(Collection.USER);
        users.count({name: req.params.uid}).then(total => {
            if(total === 0)
                failure(res, `${Error.NO_RIGHT}`);
            else
                next();
        }).catch(reason => failure(res, `${Error.DB_READ}: ${reason}`)).then(() => restore(db));
    }, reason => failure(res,`${Error.DB_CONNECT}: ${reason}`))
},(req, res, next) => {
    checkout(db => {
        const activities = db.collection(Collection.ACTIVITY);
        activities.find({master:req.params.uid},{
                _id:1, 
                rid: 1, 
                title: 1,
                created: 1
            }).sort({created: -1}).toArray().then(data => {
            success(res,data);
            removeToken(req.params.token);
        }).catch(reason => failure(res, `${Error.DB_READ}: ${reason}`)).then(() => restore(db))
    },reason => failure(res,`${Error.DB_CONNECT}: ${reason}`))
})

//登录用户获取自己创建的活动
router.route('/activities').post((req, res, next) => {
    try{
        const owner = res.locals.loginUser.user
    }catch(e){
        failure(res, Error.NO_RIGHT, 403);
        return;
    }
    next();
},(req, res,next) => {
    checkout(db => {
        const master = res.locals.loginUser.user;
        const acts = db.collection(Collection.ACTIVITY);
        acts.find({master}, {
                _id:0, 
                rid:1, 
                title:1, 
                description:1, 
                created:1})
            .sort({ created: -1 }).toArray().then(data => {
                success(res,data)
        }).catch(reason => failure(res, `${Error.DB_READ}: ${reason}`)).then(_ => restore(db));
    }, reason => {
        failure(res, `${Error.DB_CONNECT}: ${reason}`)
    })
});

//导航接口
router.route('/nav').patch((req, res, next) => {
    const id = +req.body.id;
    const checked = req.body.checked === 'true';
    checkout(db => {
        const pages = db.collection(Collection.PAGES);
        pages.findOneAndUpdate({id},{$set: {active: checked}}).then(() => {
            success(res, '调用成功')
        }).catch(reason => failure(res, `${Error.DB_WRITE}: ${reason}`)).then(() => restore(db))
    }, reason => failure(res, `${Error.DB_CONNECT}: ${reason}`))
})

/**
 * 获取当前用户相关的所有敏感词
 * @param db 
 * @param owner 
 */
async function sensitives(db: Db, owner: string) {
    const table = db.collection(Collection.SENSITIVE);
    const uBans = await table.find({owner},{_id: 0, word: 1}).toArray();
    const sBans = await table.find({owner: 'admin'}, {_id: 0, word: 1}).toArray();
    
    return {
        uBans:uBans.map(e => e.word),
        sBans:sBans.map(e => e.word)
    };
}

/**
 * 更新用户自定义敏感词
 * @param db 
 * @param words 
 * @param owner 
 */
async function updateSensitives(db: Db, words: string[], owner: string) {
    const table = db.collection(Collection.SENSITIVE);
    await table.remove({owner});
    if(words.length > 0)
        await table.insertMany(words.map(word => ({word, owner})));
}

//敏感词接口
router.route('/word').get((req, res, next) => {
    if(!res.locals.loginUser){
        failure(res, Error.NO_RIGHT, 403);
    } else {
        const owner = res.locals.loginUser.user;
        checkout(db => {
            sensitives(db, owner).then(data => {
                success(res, data);
            }).catch(reason => failure(res, `${Error.DB_READ}: ${reason}`)).then(() => restore(db));
        }, reason => failure(res, `${Error.DB_CONNECT}: ${reason}`));
    }
}).all((req, res, next) => {
    if(!res.locals.loginUser){
        failure(res, Error.NO_RIGHT, 403);
        return;
    }
    next();
}).post((req, res, next) => {
    const badwords = req.body.word||[];
    checkout(db => {
        const owner = res.locals.loginUser.user
        updateSensitives(db, badwords, owner)
            .catch(reason => failure(res, `${Error.DB_WRITE}: ${reason}`))
            .then(() => {
                restore(db);
                success(res,'更新完成');
                wordAction(WordActions.POST,{
                    word:res.locals.banwords,
                    owner
                })
            })
    },reason => failure(res, `${Error.DB_CONNECT}: ${reason}`))
}).delete((req, res, next) => {
    checkout(db => {
        const owner = res.locals.loginUser.user;
        const word = req.body.word;
        const words = db.collection(Collection.SENSITIVE);
        words.findOneAndDelete({word, owner}).then(() => {
            success(res,`删除成功 ${word}`);
            wordAction(WordActions.DELETE, {word:[word], owner});
        }).catch(reason => failure(res, `${Error.DB_WRITE}: ${reason}`)).then(() => restore(db));
    }, reason => failure(res, `${Error.DB_CONNECT}: ${reason}`))
})

//表情接口
router.route('/emotions').get((req, res, next) => {
    checkout(db => {
        const emotions = db.collection(Collection.EMOTION);
        emotions.find({},{_id:0,tag:1,url:1}).toArray().then(data => {
            success(res,data);
        }).catch(reason => failure(res, `${Error.DB_READ}: ${reason}`)).then(() => restore(db));
    },reason => failure(res, `${Error.DB_CONNECT}: ${reason}`))
})

/**
 * 生成请求token
 */
function createToken(): string {
    const token = uuid();
    //log(`生成token: ${token}`);
    tokenMap.set(token, Date.now());
    if(!has(tokenTicker))
        tokenTicker = call(deactivatedToken, 5000)
    return token;
}
/**
 * 请求成功移除token
 * @param token 
 */
function removeToken(token: string):void {
    //log(`token已使用: ${token}`)
    tokenMap.delete(token);
}
/**
 * 移除过期token
 */
function deactivatedToken(): void {
    for(const [token, date] of tokenMap.entries()) {
        if(Date.now() - date >= 30 * 1000) {
            //log(`token过期：${token}`);
            tokenMap.delete(token);
        }
    }
    if(tokenMap.size === 0) {
        remove(tokenTicker);
    }
}

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
            dfa.removeBadWord(word[0], owner);
        break;
    }
    syncTransfer({action, data}, cluster.worker);
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
            log(res.locals.loginUser.user)
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
        }, reason => failure(res, `${Error.DB_READ}: ${reason}`))
    }, reason => {
        failure(res, `${Error.DB_CONNECT}: ${reason} > ${req.params.rid}`)
    })
}

function deleteAct(req:IRequest, res:IRespond): void {
    //1.删除活动数据库
    checkout(db => {
        db.collection(Collection.ACTIVITY).deleteOne({rid: req.params.rid}).then(() => {
            //活动删除成功
            success(res);
        }, reason => {
            failure(res, `${Error.DB_WRITE}: ${reason}`)
        }).then(() => restore(db));
    }, reason => {
        failure(res, `${Error.DB_CONNECT}: ${reason} > ${req.params.rid}`)
    })
}

function patchAct(): void {
    //1.更新活动数据库
}

export default router;