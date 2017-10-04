import * as express from "express";

import { checkout, restore } from "../db/pool";
import { log, error } from "../../utils/log";
import { call } from "../../utils/ticker";

const router = express.Router();

const userMap = new Map<string,{time: number}>();
/**
 * session 有效期 2 min
 */
const SESSION_LIVE = 2 * 60 * 1000;

interface IRespond {
    end(msg: string): any;
}

function getNavFail(res:IRespond,reason: string): void {
    error(reason);
    res.end(reason);
}

//获取导航栏配置
router.use((req, res,next) => {
    checkout(db => {
        db.collection('pages').find().toArray().then(data => {
            if(data) {
                res.locals.pages = data;
                next();
            }else{
                getNavFail(res, '没有导航数据');
            }
        },reason => {
            getNavFail(res, reason);
        }).then(() => {
            restore(db);
        })
    },reason => {
        getNavFail(res, reason);
    })
})
//生成session
router.use((req, res, next) => {
    if(!userMap.has(<string>req.sessionID)){
        //log('欢迎您 未登录')
        userMap.set(<string>req.sessionID, {time:Date.now()});
    }else{
        //log('欢迎回来已登录')
    }
    next();
})

router.route('/').all((req, res, next) => {
    res.render('index', {navlist: res.locals.pages});
})
/**
 * 介绍路由
 */
router.route('/intro').all((req, res, next) => {
    res.render('intro', {navlist: res.locals.pages});
})

/**
 * 联系我们路由
 */
router.route('/concat').all((req, res, next) => {
    res.render('concat', {navlist: res.locals.pages});
})

router.route('/register').get((req, res, next) => {
    res.render('register',{navlist: res.locals.pages});
}).post((req, res, next) => {
    checkout(db => {
        let userTable = db.collection('user');
        userTable.findOne({name:req.body.username}).then(data => {
            if(data) {
                error('已存在用户名，请更换其他昵称');
                res.json({ok:false,reason:'已存在用户名，请更换其他昵称'});
            }else{
                userTable.insert({name: req.body.username, pwd: req.body.pwd}).then(() => {
                    res.json({ok:true,result:'注册成功'});
                })
            }
        },reason => {
            error(reason)
            res.json({ok:false,reason});
        }).then(() => {
            restore(db);
        })
    }, reason => {
        error(reason)
        res.json({ok:false,reason});
    })
})

call(() => {
    for(let [key,{time}] of userMap.entries()) {
        if(time < Date.now()) {
            userMap.delete(key);
            return;
        }
    }
}, SESSION_LIVE);

export default router