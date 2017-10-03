import * as express from "express";

import { checkout, restore } from "../db/pool";
import { log, error } from "../../utils/log";

const router = express.Router();

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

interface IRespond {
    end(msg: string): any;
}

function getNavFail(res:IRespond,reason: string): void {
    error(reason);
    res.end(reason);
}

router.route('/').all((req, res, next) => {
    res.render('index', {navlist: res.locals.pages});
})
/**
 * 介绍路由
 */
router.route('/intro').all((req, res, next) => {
    res.render('intro', {navlist: res.locals.pages});
})

router.route('/concat').all((req, res, next) => {
    res.render('concat', {navlist: res.locals.pages});
})

export default router