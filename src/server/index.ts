import * as expressSession from 'express-session';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from "body-parser";

import * as cluster from 'cluster';
import * as path from 'path';
import {log} from '../utils/log';

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
app.use('/static',express.static('public'));
app.use('/js',express.static('dist/browser'));

//模板路径
app.set('views','./views');
app.set('view engine','pug');

log('服务器运行环境：' + app.get('env'));

const userMap = new Map<string,{time: number}>();

app.use((req,res,next) => {
    log(<string>req.sessionID);
    next();
})
app.route('/').get((req,res) => {
    if(userMap.has(<string>req.sessionID)){
        //res.end(`welcome come back: ${req.sessionID}`);
        res.render('index',{message:'又来了'})
    }else{
        userMap.set(<string>req.sessionID,{time:Date.now()});
        res.render('index',{message:'你好啊'})
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
        for(let [key,{time}] of userMap.entries()) {
            if(time < Date.now()) {
                userMap.delete(key);
                return;
            }
        }
    },1000 * 60 * 2)
}).once('close',() => {
    clearInterval(clearid);
})

//线程管理
if(cluster.isMaster){
    /**
     * 异步模块调用, 后期启动慢可改为Promise.all
     */
    async function workerGo() {
        const [
            { syncTransfer },
            { Actions: actions },
            {increaseOne, reduceOne, reduceAll},
            { cpus }
        ] = await Promise.all([
            import('./worker/syncTransfer'),
            import('./worker/actions'),
            import('./net/online'),
            import('os')
        ])

        return {syncTransfer, actions, increaseOne, reduceOne, reduceAll, cpuNum: cpus().length};
    }
    
    cluster.setupMaster({
        exec: path.resolve(__dirname,'worker','dmworker.js'),
        args:[ports.ws.toString()]
    });
    workerGo().then(({syncTransfer, cpuNum, actions, increaseOne, reduceOne, reduceAll}) => {
        //启动弹幕线程
        log(`主线程 PID: ${process.pid}, CPU: ${cpuNum} 个`);
        for(let i = 0; i < cpuNum; ++i) {
            cluster.fork()
        }
        cluster.on(WorkerEvent.EXIT,(worker,code,signal) => {
            log(`工作线程意外关闭 code: ${code}, signal: ${signal}`);
            syncTransfer(worker,{action: actions.DESTROY, data: reduceAll(worker)});
            //重启线程
            if(!worker.exitedAfterDisconnect) {
                log('主线程重启工作线程');
                process.nextTick(() => cluster.fork());
            }
        }).on(WorkerEvent.MESSAGE, (worker,message) => {
            let {action,pathname} = message;
            if(action === actions.ENTRY) {
                Object.assign(message,{total:increaseOne(worker, pathname)});
            }else if(action === actions.LEAVE) {
                Object.assign(message,{total:reduceOne(worker, pathname)});
            }
            syncTransfer(worker, message);
        });
    })
}