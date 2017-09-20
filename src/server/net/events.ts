/**
 * 弹幕连接事件
 */
export enum WebSocketEvent {
    /**
     * 建立连接
     */
    CONNECTION = 'connection',
    /**
     * 服务器端口监听事件
     */
    LISTENING = 'listening',
    /**
     * 收到消息
     */
    MESSAGE = 'message',
    /**
     * 错误消息
     */
    ERROR = 'error',
    /**
     * 连接关闭
     */
    CLOSE = 'close'
};