import * as express from "express";

import { checkout, restore, insert } from "../db/pool";
import { Collection } from "../db/collection";
import { cache, get } from "../../utils/caches";
import { log, error } from "../../utils/log";
import { success, failure } from "../../utils/feedback";
import { ADMIN_LIST } from "../config/conf";

const adminApp = express();

adminApp.route('/').all((req, res, next) => {
    //这里能干点什么
    next();
}).get((req, res, next) => {
    res.render('admin',{cache:false,loginUser:res.locals.loginUser, list: ADMIN_LIST});
})

export default adminApp;