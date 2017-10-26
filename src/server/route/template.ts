import { exists } from 'fs';
import * as express from "express";
import * as path from 'path';
import * as util from 'util'

import { log, error } from "../../utils/log";
import { failure, success } from "../../utils/feedback";
import { compileFile } from 'pug';

const router = express.Router();

async function existPug(url: string) {
    return await util.promisify(exists)(url);
}

router.route('/:name').get((req, res, next) => {
    const pugPath = path.resolve('public','template',req.params.name + '.pug');
    existPug(pugPath).then(bool => {
        if(bool) {
            const compileMethod = compileFile(pugPath);
            res.end(compileMethod());
        }else {
            next();
        }
    })
})

export default router;