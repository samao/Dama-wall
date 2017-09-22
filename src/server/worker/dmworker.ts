import {log,error} from '../../utils/log';
import * as http from 'http';
import * as cluster from 'cluster';

async function go() {
    const port = +process.argv.slice(2);
    let mod = await import('../net/dmserver');
    let {DanmuServer} = mod;
    log(`线程${cluster.worker.id} 模块载入成功 PID ${process.pid}`);
    const wss = new DanmuServer({
        port
    });
}

go().catch(() => {
    error('弹幕线程启动异常,请检查端口是否被占用。')
});