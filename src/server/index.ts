import * as express from "express";
import {log} from 'util';

const app = express();

app.route('/').get((req, res, next) => {
    res.end('Hello Express');
});

const server = app.listen(3000,() => {
    const {address,port} = server.address();
    log(`服务器启动: http://${address}:${port}`);
});

import('./user').then(mod => {
    const {User} = mod;
    let {name,age} = new User('王胖子',31);
    log(`发现个肉货:${name},年龄：${age}`);
})