import * as express from "express";

import { checkout, restore, insert } from "../db/pool";
import { Collection } from "../db/collection";
import { cache, get } from "../../utils/caches";
import { log, error } from "../../utils/log";
import { success, failure } from "../../utils/feedback";

const adminApp = express();

adminApp.route('/').all((req, res, next) => {
    log('登录用户是否是管理员:', res.locals.loginUser.admin);
    if(!res.locals.loginUser || !res.locals.loginUser.admin) {
        failure(res, '用户没有管理权限');
        return;
    }
    res.locals.adminUser = res.locals.loginUser.admin;
    next();
}).get((req, res, next) => {
    res.render('admin',res.locals.adminUser);
})

export default adminApp;