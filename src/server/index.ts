import * as express from "express";
import {log} from 'util';

const app = express();

app.route('/').get((req, res, next) => {
    res.end('Hello Express');
});


const server = app.listen(3000,() => {
    const {address,port} = server.address();
    log(`服务器启动: http://${address}:${port}`);
})