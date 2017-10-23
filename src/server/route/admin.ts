import * as express from "express";

import { checkout, restore, insert } from "../db/pool";
import { Collection } from "../db/collection";
import { cache, get } from "../../utils/caches";
import { log, error } from "../../utils/log";
import { success, failure } from "../../utils/feedback";

const adminApp = express();

adminApp.route('/').all((req, res, next) => {
    //这里能干点什么
    next();
}).get((req, res, next) => {
    res.render('admin',res.locals.loginUser);
})

export default adminApp;