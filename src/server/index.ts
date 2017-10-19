import * as expressSession from 'express-session';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from "body-parser";
import * as cluster from 'cluster';
import * as path from 'path';
import * as connectMongo from "connect-mongo";

import {log} from '../utils/log';
import {secret,ports} from './config/conf'
import {WorkerEvent} from './worker/events';
import danmuRouter from './route/danmu';
import pageRouter from "./route/page";
import Api from "./route/api";

//import * as multer from "multer";

const app = express();
const MongoStore = connectMongo(expressSession);

app.disable('x-powered-by');
log('服务器运行环境：' + app.get('env'));

//json 化数据 application/json
app.use(bodyParser.json());
// application/x-www-form-url
app.use(bodyParser.urlencoded({extended:true}));
// 获取请求cookie
app.use(cookieParser(secret));
//multipart/form-data
//app.use(multer());

//线上环境使用mongodb 存储session 默认自动删除过期session
app.use(expressSession({
    resave:false,
    saveUninitialized:true,
    secret,
    store:new MongoStore({
        url:`mongodb://localhost:${ports.db}/sessions`,
    }),
    genid:(req) => {
        let time = Date.now() + `_${secret}_` + Math.floor(Math.random() * 1000);
        return Buffer.from(time).toString('base64');
    }
}));

app.use((req, res, next) => {
    res.setHeader('Server','DamaServer')
    next();
})

//静态资源
app.use('/static',express.static('public'));
app.use('/js',express.static('dist/browser'));

//模板路径
app.set('views','./views');
app.set('view engine','pug');

//http 接受聊天信息路由
app.use('/danmu',danmuRouter);
//页面导航
app.use(pageRouter);
//接口api
app.use('/api', Api);

app.use((req, res, next) => {
    res.render('404',{navlist: res.locals.pages,error:'水逆飞船爆炸了(1/1)'});
})

const server = app.listen(ports.web,() => {
    const {address,port} = server.address();
    log(`http服务器启动: http://${address}:${port}`);
})

//线程管理
if(cluster.isMaster){
    // 异步模块调用
    async function workerGo() {
        const [
            { syncTransfer },
            { Actions: actions },
            {increaseOne, reduceOne, reduceAll},
            { cpus },
            {default: sensitive}
        ] = await Promise.all([
            import('./worker/syncTransfer'),
            import('./worker/actions'),
            import('./net/online'),
            import('os'),
            import('./db/danmuCertify')
        ])

        let { setupUnique } = await import('./db/pool');
        log('创建MongoDB索引');
        let indexes = await setupUnique();
        log(`共创建 ${indexes.length} 个索引`);

        //全局敏感词初始化
        log('加载全局通用敏感词')
        let sensitives = await sensitive.setup();
        log('敏感词：',JSON.stringify(sensitives))

        return {syncTransfer, actions, increaseOne, reduceOne, reduceAll, cpuNum: cpus().length, sensitives};
    }

    
    workerGo().then(({syncTransfer, cpuNum, actions, increaseOne, reduceOne, reduceAll, sensitives}) => {
        //启动弹幕线程
        log(`主线程 PID: ${process.pid}, CPU: ${cpuNum} 个`);

        cluster.setupMaster({
            exec: path.resolve(__dirname,'worker','DanmuWorker.js'),
            args:[ports.ws.toString()],
        });
        let workerSet: Set<cluster.Worker> = new Set();
        for(let i = 0; i < cpuNum; ++i) {
            workerSet.add(cluster.fork({sensitives}));
        }
        cluster.on(WorkerEvent.EXIT,(worker,code,signal) => {
            log(`工作线程意外关闭 code: ${code}, signal: ${signal}`);
            syncTransfer({action: actions.DESTROY, data: reduceAll(worker)}, worker);
            //重启线程
            if(!worker.exitedAfterDisconnect) {
                log('主线程重启工作线程');
                process.nextTick(() => cluster.fork({sensitives}));
            }
        }).on(WorkerEvent.MESSAGE, (worker,message) => {
            let {action,pathname} = message;
            if(action === actions.ENTRY) {
                Object.assign(message,{total:increaseOne(worker, pathname)});
            }else if(action === actions.LEAVE) {
                Object.assign(message,{total:reduceOne(worker, pathname)});
            }
            syncTransfer(message, worker);
        }).on(WorkerEvent.FORK,(worker) => {
            workerSet.delete(worker);
            if(workerSet.size === 0) {
                cluster.removeAllListeners(WorkerEvent.FORK);
                log('=== 所有服务启动完毕 ===');
            }
        })
    })
}