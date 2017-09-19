import * as express from "express";
import {log} from 'util';
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
//import * as multer from "multer";

const app = express();

app.route('/').get((req, res, next) => {
    res.end('Hello Express');
});

const server = app.listen(3000,() => {
    const {address,port} = server.address();
    log(`服务器启动: http://${address}:${port}`);
});

//json 化数据 application/json
app.use(bodyParser.json());
// application/x-www-form-url
app.use(bodyParser.urlencoded({extended:true}));
// 获取请求cookie
app.use(cookieParser());
//multipart/form-data
//app.use(multer());

//静态资源
app.use('static',express.static('public'));
//模板路径
app.set('views','./views');
app.set('view engine','pug');

import('./user').then(mod => {
    const {User} = mod;
    let {name,age} = new User('王胖子',31);
    log(`发现个肉货:${name},年龄：${age}`);
})