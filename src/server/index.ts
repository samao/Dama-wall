import expressSession = require('express-session');
import express = require('express');
import cookieParser = require('cookie-parser');
import bodyParser = require("body-parser");

import {log} from 'util';

//import * as multer from "multer";

const app = express();

//json 化数据 application/json
app.use(bodyParser.json());
// application/x-www-form-url
app.use(bodyParser.urlencoded({extended:true}));
// 获取请求cookie
app.use(cookieParser('idzeir'));
//multipart/form-data
//app.use(multer());
app.use(expressSession({
    name:'client',
    resave:true,
    saveUninitialized:true,
    secret:'idzeir',
    genid:(req) => {
        let time = Date.now() + '#' + Math.floor(Math.random() * 1000);
        return '$_'+Buffer.from(time).toString('base64')
    }
}))

//静态资源
app.use('static',express.static('public'));
//模板路径
app.set('views','./views');
app.set('view engine','pug');

log('运行环境：' + app.get('env'));

const userMap = new Map<string,any>();

app.route('/').get((req,res) => {
	//console.log(req.cookies,req.session,req.sessionID)
    if(userMap.has(<string>req.sessionID)){
        res.end('welcome come back');
    }else{
        userMap.set(<string>req.sessionID,{time:Date.now()});
        res.end('hello')
    }
})

let clearid:NodeJS.Timer;

const server = app.listen(3000,() => {
    const {address,port} = server.address();
    log(`服务器启动: http://${address}:${port}`);

    clearid = setInterval(() => {
        let keys = Reflect.ownKeys(userMap);
        for(let k of keys) {
            if(Reflect.get(userMap,k).time < Date.now()) {
                userMap.delete(k.toString());
            }
        }
    },1000 * 60 * 2)
}).once('close',() => {
    clearInterval(clearid);
})

import('./net/dmserver').then(mod => {
    let {DanmuServer} = mod;
    log('模块加载成功，启动弹幕服务');
    const wss = new DanmuServer({
        server
    });
})