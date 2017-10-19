import * as express from "express";
import * as path from 'path';

import { checkout, restore } from "../db/pool";
import { Collection } from "../db/collection";
import { log, error } from "../../utils/log";
import { call } from "../../utils/ticker";
import { cache, get } from "../../utils/caches";
import { failure, success } from "../../utils/feedback";

const router = express.Router();

interface ISessionData {
    expires: number;
    user: string;
}

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
//session 缓存
let sySession: Symbol;
/**
 * session 有效期 2 min
 */
const SESSION_LIVE = 2 * 60 * 60 * 1000;

/**
 * 缓存页面导航数据
 */
let syPages: Symbol;

/**
 * 包装页面导航信息
 * @param ref 
 * @param res 
 * @param next
 */
function setupNavigatorInfo(ref: string, res: IRespond, next: Function): void {
    const pages = get<IPageConf[]>(syPages);
    res.locals.pages = pages;
    let currentPage = pages.filter(e => e.ref === ref)
    if (currentPage.length !== 0) {
        res.locals.currentPage = currentPage[0];
    }
    next();
}

//获取导航栏配置
router.use((req, res, next) => {
    if (!syPages) {
        checkout(db => {
            //查询按id排序1,2,...
            db.collection(Collection.PAGES).find().sort({id:1}).toArray().then(data => {
                if (data) {
                    syPages = cache(data)
                    //log(`页面导航数据：${JSON.stringify(syPages)}`);
                    setupNavigatorInfo(req.url, res, next);
                } else {
                    failure(res, '没有导航数据');
                }
            }, reason => {
                failure(res, reason);
            }).then(() => {
                restore(db);
            })
        }, reason => {
            failure(res, reason);
        })
    } else {
        setupNavigatorInfo(req.url, res, next);
    }
})
//生成session
router.use((req, res, next) => {
    const sMap = sessions();
    if (!sMap.has(<string>req.sessionID)) {
        //log('欢迎您 未登录')
        res.locals.loginUser = null;
    } else {
        //log('欢迎回来已登录')
        res.locals.loginUser = sMap.get(<string>req.sessionID);
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

router.route('/login').get((req, res, next) =>{
    res.render('login', merge(res, { currentPage: res.locals.currentPage}));
}).post((req, res, next) => {
    let {username,pwd} = req.body;
    checkout(db => {
        db.collection(Collection.USER).findOne({name:username,pwd}).then(data => {
            if(data) {
                sessions().set(<string>req.sessionID, { expires: Date.now() + SESSION_LIVE , user: data.name});
                success(res);
            }else{
                failure(res, '用户名或者密码错误')
            }
        })
    }, reason => {
        failure(res, reason);
    })
})

router.route('/logout').post((req, res, next) => {
    sessions().delete(<string>req.sessionID);
    success(res);
})

router.route('/register').get((req, res, next) => {
    res.render('register', merge(res, { currentPage: res.locals.currentPage }));
}).post((req, res, next) => {
    checkout(db => {
        let userTable = db.collection(Collection.USER);
        userTable.findOne({ name: req.body.username }).then(data => {
            if (data) {
                failure(res, '已存在用户名，请更换其他昵称')
            } else {
                userTable.insert({ name: req.body.username, pwd: req.body.pwd }).then(() => {
                    sessions().set(<string>req.sessionID, { expires: Date.now() + SESSION_LIVE , user: req.body.username});
                    success(res, '注册成功')
                })
            }
        }, reason => {
            failure(res, reason)
        }).then(() => {
            restore(db);
        })
    }, reason => {
        failure(res, reason)
    })
})

router.route('/download').get((req, res, next) => {
    res.render('download', merge(res, { link: '/static/download/dama.txt' }))
})

router.route('/setting').get((req, res, next) => {
    log(`用户个人设置 ${req.sessionID}`);
    res.render('setting',{user:res.locals.loginUser})
})

//弹幕二维码生成路由
router.get('/qr/:rid', (req, res, next) => {
    checkout(db => {
        db.collection(Collection.ACTIVITY).findOne({rid:req.params.rid}).then(data => {
            if(data) {
                res.sendFile(path.resolve('public', 'images', 'qr', `${req.params.rid}.png`))
            }else {
                failure(res, '不存在的活动')
            }
        }, reason => {
            failure(res, '查询数据库活动错误')
        })
    }, reason => {
        failure(res, '无法连接数据库')
    })
});

function merge(res: IRespond, data?: any): any {
    return { navlist: res.locals.pages, loginUser: res.locals.loginUser, ...data };
}

/**
 * 获取缓存模块中的 用户 session 数据 
 */
function sessions():Map<string, ISessionData> {
    if(!sySession)
        sySession = cache(new Map())
    return get<Map<string, ISessionData>>(sySession)
}

call(() => {
    const map = sessions();
    for (let [key, { expires }] of map.entries()) {
        if (expires < Date.now()) {
            map.delete(key);
            return;
        }
    }
}, SESSION_LIVE);

export default router