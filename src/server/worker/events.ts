export enum WorkerEvent {
    /**
     * 工作进程ipc管道断开，检测进程是否被卡住
     */
    DISCONNECT = 'disconnect',
    /**
     * 进程错误
     */
    ERROR = 'error',
    /**
     * 工作进程调用listen时出发
     */
    LISTENING = 'listening',
    /**
     * 收到进程消息
     */
    MESSAGE = 'message',
    /**
     * 进程退出
     */
    EXIT = 'exit'
}