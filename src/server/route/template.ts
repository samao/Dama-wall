import * as express from "express";
import * as path from 'path';

import { log, error } from "../../utils/log";
import { failure, success } from "../../utils/feedback";
import { compileFile } from 'pug';

const router = express.Router();

router.route('/:name').get((req, res, next) => {
    log('模板路径',path.resolve('public','template',req.params.name + '.pug'));
    const compileMethod = compileFile(path.resolve('public','template',req.params.name + '.pug'));
    res.end(compileMethod());
})

export default router;