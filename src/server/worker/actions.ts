/**
 * 线程数据同步 action
 */
export enum Actions {
    /**
     * 用户进入线程动作
     */
    ENTRY = 'entry',
    /**
     * 用户离开线程动作
     */
    LEAVE = 'leave',
    /**
     * 用户聊天内容线程同步
     */
    POST = 'post',
    /**
     * 当前房间用户数请求
     */
    ONLINE = 'online',
    /**
     * 心跳
     */
    HEART = 'heart',

    /**
     * 工作线程退出销毁
     */
    DESTROY = 'destroy'
}