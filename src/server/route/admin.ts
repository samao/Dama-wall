import * as express from "express";
import * as path from 'path';

import { checkout, restore, insert } from "../db/pool";
import { Collection } from "../db/collection";
import { cache, get } from "../../utils/caches";
import { log, error } from "../../utils/log";
import { success, failure } from "../../utils/feedback";
import { adminPage } from "../config/conf";

const adminApp = express();

adminApp.route('/admin').all((req, res, next) => {
    //这里能干点什么
    next();
}).get((req, res, next) => {
    res.render('admin',{cache:false,loginUser:res.locals.loginUser, list: adminPage});
})

adminApp.route('/template/:name').get((req, res, next) => {
    const pugPath = path.join('template',req.params.name + '.pug');
    log('请求模板', pugPath);
    res.render(pugPath, {title:req.params.name, list:['asdasd','usshas','128127']})
})

export default adminApp;