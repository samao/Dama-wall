/**
 * 弹幕连接事件
 */
export enum WebSocketEvent {
    /**
     * 建立连接
     */
    CONNECTION = 'connection',
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