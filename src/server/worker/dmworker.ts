import {log} from 'util';
import * as http from 'http';
import * as cluster from 'cluster';

async function go() {
    const port = +process.argv.slice(2);
    let mod = await import('../net/dmserver');
    let {DanmuServer} = mod;
    log(`线程：${cluster.worker.id} -> 弹幕模块载入完成，启动弹幕服务 pid = ${process.pid}`);
    const wss = new DanmuServer({
        port
    });
}

go().catch(() => {
    log('弹幕线程未收到端口参数或收到错误参数')
});