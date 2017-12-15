export enum Error {
    //数据库相关错误
    DB_CONNECT = '无法建立数据库连接',
    DB_READ = '无法读取数据库',
    DB_WRITE = '无法写入数据库',
    
    //用户权限不足
    NO_RIGHT = '权限不足',
    //用户信息错误
    INCORRECT_USER_PASSWORD = '用户名或者密码错误',
    //重复的用户
    REPEATED_USER = '已存在用户名，请更换其他昵称',
    //参数错误
    INCORRECT_ARGUMENTS = '请求参数错误',
    //数据不足
    NO_DATA = '数据不足'
}

export enum IOError {
    //清除无心跳用户
    DEACTIVATED = '服务器清除空闲僵尸连接',
    //非登录用户禁止发送消息
    NO_LOGIN_USER = '非登录用户，权限不足,请发送登录消息.',
    //发送数据格式错误
    INCORRECT_MESSAGE = '服务器收到错误消息',
    //活动rid错误
    INCORRECT_PATH = '无法验证访问路径'
}