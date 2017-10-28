import * as express from "express";
import * as path from 'path';

import { checkout, restore, insert } from "../db/pool";
import { Collection } from "../db/collection";
import { cache, get } from "../../utils/caches";
import { log, error } from "../../utils/log";
import { success, failure } from "../../utils/feedback";
import { adminPage } from "../config/conf";
import { obtain } from "../controler/adminControler";

const adminApp = express();

adminApp.disable('x-powered-by');

adminApp.route('/admin').all((req, res, next) => {
    //这里能干点什么
    next();
}).get((req, res, next) => {
    res.render('admin',{loginUser:res.locals.loginUser, list: adminPage});
})

adminApp.route('/template/:board').get((req, res, next) => {
    const pugPath = path.join('template',req.params.board + '.pug');
    log('请求模板', pugPath);
    obtain(req.params.board).then(data => {
        res.render(pugPath, data, (error, html) => {
            if(error) {
                res.sendStatus(404);
                res.end(`渲染模板失败 ${pugPath}`);
            }else {
                res.setHeader('Content-Type','text/plain; charset=utf-8');
                res.end(html);
            }
        })
    }).catch(reason => next(reason))
})

export default adminApp;