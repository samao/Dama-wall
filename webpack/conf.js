const { join,resolve } = require('path')
const { log } = require('util')
//浏览器js文件夹
const browser = resolve('src','browser');

const allMap = {
    main: join(browser, 'index.ts'),
    send: join(browser, 'send.ts'),
    register: join(browser, 'register.ts'),
    login: join(browser, 'login.ts'),
    logout: join(browser, 'logout.ts'),
    admin: join(browser, 'admin.ts'),
    setting: join(browser, 'setting.ts'),
    boards:{
        user: join(browser, 'boards', 'user.ts'),
        nav: join(browser, 'boards', 'nav.ts')
    },
    user:{
        activity: join(browser, 'user','activity.ts'),
        filter: join(browser, 'user', 'filter.ts'),
        security: join(browser, 'user', 'security.ts'),
        createAct: join(browser, 'user', 'createAct.ts')
    }
}

/**
 * 支持多层级js导出
 * @param  data 导出配置
 * @param  pKey 导出目录相对于webpack 根目录
 */
function parserMap(data,pKey = '') {
    for(let key of Reflect.ownKeys(data)) {
        let value = Reflect.get(data, key);
        if(typeof value === 'string') {
            Reflect.set(entry, join(pKey, key), value);
            log(`编译文件配置: ${join(pKey, key)}, 入口: ${value}`);
        }else{
            parserMap(value, join(pKey, key));
        }
    }
}

const entry = {}

parserMap(allMap);

module.exports = { entry }