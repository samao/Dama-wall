import * as expressSession from 'express-session';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from "body-parser";

import * as cluster from 'cluster';
import * as path from 'path';
import {log} from 'util';

import {secret,ports} from './config/conf'
import {WorkerEvent} from './worker/events';

//import * as multer from "multer";

const app = express();

//json 化数据 application/json
app.use(bodyParser.json());
// application/x-www-form-url
app.use(bodyParser.urlencoded({extended:true}));
// 获取请求cookie
app.use(cookieParser(secret));
//multipart/form-data
//app.use(multer());
app.use(expressSession({
    resave:false,
    saveUninitialized:true,
    secret,
    genid:(req) => {
        let time = Date.now() + `_${secret}_` + Math.floor(Math.random() * 1000);
        return Buffer.from(time).toString('base64');
    }
}))

//静态资源
app.use('static',express.static('public'));
//模板路径
app.set('views','./views');
app.set('view engine','pug');

log('运行环境：' + app.get('env'));

const userMap = new Map<string,any>();

app.use((req,res,next) => {
    log(<string>req.sessionID);
    next();
})
app.route('/').get((req,res) => {
    if(userMap.has(<string>req.sessionID)){
        res.end(`welcome come back: ${req.sessionID}`);
    }else{
        userMap.set(<string>req.sessionID,{time:Date.now()});
        res.end('hello')
    }
})

app.route('/user').get((req,res,next) => {
    res.end(`${req.sessionID}`);
})

let clearid:NodeJS.Timer;

const server = app.listen(ports.web,() => {
    const {address,port} = server.address();
    log(`http服务器启动: http://${address}:${port}`);

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

//线程管理
if(cluster.isMaster){
    //启动弹幕线程
    log('启动弹幕线程...')
    cluster.setupMaster({
        exec: path.resolve(__dirname,'worker','dmworker.js'),
        args:[ports.ws.toString()],
    });

    import('os').then(os => {
        let {cpus} = os;
        //按cpu数启动线程
        for(let i = 0; i < cpus().length; ++i) {
            cluster.fork()
        }
    })

    cluster.on(WorkerEvent.EXIT,(worker,code,signal) => {
        if(signal){
			log(`worker was killed by signal:${signal}`)
		}else if(code !== 0) {
			log(`worker exited with error code:${code}`)
		}else{
			log(`worker success ${worker.process.pid}`)
        }
        //重启线程
        if(!worker.exitedAfterDisconnect)
            cluster.fork();
    }).on(WorkerEvent.MESSAGE, (worker,message) => {
        /*
        子线程处理用户消息，不同的用户可能连接到不同的线程，
        所以需要master作为桥，同步所有room 消息
        */
        let {data: {pathname, uid}} = message;
        log(`子线程报告 -> 用户 ${uid} 房间 ${pathname}, 线程id ${worker.id}`);
    })
}