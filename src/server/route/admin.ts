import * as express from "express";
import * as QRCode from "qrcode";
import * as path from 'path';

import { checkout, restore, insert } from "../db/pool";
import { Collection } from "../db/collection";
import { cache, get } from "../../utils/caches";
import { log, error } from "../../utils/log";
import { success, failure } from "../../utils/feedback";

enum Level {
    OWNER,
    MASTER,
    REPORTER
}

interface IAdmin {
    username: string;
    level: Level;
}

const router = express.Router();

let syAdmin:Symbol;

router.route('/').all((req, res, next) => {
    //登录页面
    if(!req.sessionID) {
        failure(res, '无法获取请求session');
        return;
    }
    if(sessions().has(req.sessionID))
        res.locals.adminUser = sessions().get(req.sessionID)
    else
        res.locals.adminUser = null;
    
    next();
}).get((req, res, next) => {
    res.render('admin',res.locals.adminUser);
}).post((req, res, next) => {
    //登录接口
    checkout(db => {
        const adminTable = db.collection(Collection.ADMIN);
        const {username, password} = req.body;
        adminTable.findOne({
            username,
            password
        }).then(data => {
            if(data) {
                //保存session
                sessions().set(<string>req.sessionID, {username, level:data.level})
                //发送成功
                success(res,'登录成功');
            }else
                failure(res, '用户名或密码错误')
        }).then(() => {
            restore(db);
        })
    }, reason => {
        failure(res, '无法连接数据库')
    })
})

function sessions():Map<string, IAdmin> {
    if(!syAdmin)
        syAdmin = cache(new Map())
    return get<Map<string, IAdmin>>(syAdmin)
}

export default router;