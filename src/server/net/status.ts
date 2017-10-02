export enum WebSocketStatus {
    /**
     * 消息成功
     */
    POST = 200,
    /**
     * 登录消息成功
     */
    AUTH,
    /**
     * 房间用户数
     */
    ONLINE,
    /**
     * 服务器请求客户端登录
     */
    REQUIRE_AUTH,
    /**
     * 权限不够状态吗
     */
    FORBID = 403,
    /**
     * 服务器内部错误
     */
    ERROR = 500,
    /**
     * 非法请求路径
     */
    ILLEGAL
}