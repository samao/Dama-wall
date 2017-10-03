import * as express from "express";

const router = express.Router();

/**
 * 介绍路由
 */
router.route('/intro').all((req, res, next) => {
    res.render('intro',{})
})

router.route('/concat').all((req, res, next) => {
    res.render('concat',{});
})

export default router