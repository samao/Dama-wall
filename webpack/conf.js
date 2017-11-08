const {join} = require('path')

const allMap = {
    main:'./src/browser/index.ts',
    send:'./src/browser/send.ts',
    register:'./src/browser/register.ts',
    login:'./src/browser/login.ts',
    logout:'./src/browser/logout.ts',
    admin:'./src/browser/admin.ts',
    boards:{
        user:'./src/browser/boards/user.ts',
        nav:'./src/browser/boards/nav.ts'
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
        }else{
            parserMap(value, join(pKey, key));
        }
    }
}

const entry = {}

parserMap(allMap);

module.exports = {entry}