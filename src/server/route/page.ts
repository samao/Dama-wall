import * as express from "express";

import { checkout, restore } from "../db/pool";
import { Collection } from "../db/collection";
import { log, error } from "../../utils/log";
import { call } from "../../utils/ticker";

const router = express.Router();

const userMap = new Map<string, { time: number }>();
/**
 * session 有效期 2 min
 */
const SESSION_LIVE = 2 * 60 * 1000;

/** 页面导航数据接口 */
interface IPageConf {
    /**
     * 显示顺序
     */
    id: number;
    /**
     * 连接目标
     */
    ref: string;
    /**
     * 连接内容
     */
    label: string;
    template?: string;
}

/**
 * 缓存页面导航数据
 */
let pagesConf: IPageConf[];

//获取导航数据失败
function getNavigatorFailure(res: IRespond, reason: string): void {
    error(reason);
    res.json({ ok: false, reason });
}

/**
 * 包装页面导航信息
 * @param ref 
 * @param res 
 * @param next
 */
function setupNavigatorInfo(ref: string, res: IRespond, next: Function): void {
    res.locals.pages = pagesConf;
    let currentPage = pagesConf.filter(e => e.ref === ref)
    if (currentPage.length !== 0) {
        res.locals.currentPage = currentPage[0].id;
    }
    next();
}

//获取导航栏配置
router.use((req, res, next) => {
    if (!pagesConf) {
        checkout(db => {
            db.collection(Collection.PAGES).find().toArray().then(data => {
                if (data) {
                    data = data.sort((a, b) => a.id - b.id)
                    pagesConf = [...data];
                    //log(`页面导航数据：${JSON.stringify(pagesConf)}`);
                    setupNavigatorInfo(req.url, res, next);
                } else {
                    getNavigatorFailure(res, '没有导航数据');
                }
            }, reason => {
                getNavigatorFailure(res, reason);
            }).then(() => {
                restore(db);
            })
        }, reason => {
            getNavigatorFailure(res, reason);
        })
    } else {
        setupNavigatorInfo(req.url, res, next);
    }
})
//生成session
router.use((req, res, next) => {
    if (!userMap.has(<string>req.sessionID)) {
        //log('欢迎您 未登录')
        userMap.set(<string>req.sessionID, { time: Date.now() });
    } else {
        //log('欢迎回来已登录')
    }
    next();
})

router.route('/').all((req, res, next) => {
    res.render('index', merge(res, { currentPage: res.locals.currentPage }));
})
/**
 * 介绍路由
 */
router.route('/intro').all((req, res, next) => {
    res.render('intro', merge(res, { currentPage: res.locals.currentPage }));
})

/**
 * 联系我们路由
 */
router.route('/concat').all((req, res, next) => {
    res.render('concat', merge(res, { currentPage: res.locals.currentPage }));
})

router.route('/register').get((req, res, next) => {
    res.render('register', merge(res));
}).post((req, res, next) => {
    checkout(db => {
        let userTable = db.collection(Collection.USER);
        userTable.findOne({ name: req.body.username }).then(data => {
            if (data) {
                error('已存在用户名，请更换其他昵称');
                res.json({ ok: false, reason: '已存在用户名，请更换其他昵称' });
            } else {
                userTable.insert({ name: req.body.username, pwd: req.body.pwd }).then(() => {
                    res.json({ ok: true, result: '注册成功' });
                })
            }
        }, reason => {
            error(reason)
            res.json({ ok: false, reason });
        }).then(() => {
            restore(db);
        })
    }, reason => {
        error(reason)
        res.json({ ok: false, reason });
    })
})

router.route('/download').get((req, res, next) => {
    res.render('download', merge(res, { link: '/static/download/dama.txt' }))
})

function merge(res: IRespond, data?: any): any {
    return { navlist: res.locals.pages, ...data };
}

call(() => {
    for (let [key, { time }] of userMap.entries()) {
        if (time < Date.now()) {
            userMap.delete(key);
            return;
        }
    }
}, SESSION_LIVE);

export default router