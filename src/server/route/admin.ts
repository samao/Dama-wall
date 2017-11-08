/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 10:29:42 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2017-11-08 15:08:42
 */

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
    res.render('admin',{'cache':false,loginUser:res.locals.loginUser, list: adminPage});
})

adminApp.route('/template/:board').get((req, res, next) => {
    const pugPath = path.join('template',req.params.board + '.pug');
    log('请求模板', pugPath);
    obtain(req.params.board).then(data => {
        //log(JSON.stringify(data));
        res.render(pugPath, Object.assign(data,{cache:false}), (err, html) => {
            if(err) {
                error('渲染模板失败',err);
                res.sendStatus(500);
                res.end(`渲染模板失败 ${pugPath}`);
            }else {
                res.setHeader('Content-Type','text/plain; charset=utf-8');
                res.end(html);
            }
        })
    }).catch(reason => next(reason))
})

export default adminApp;