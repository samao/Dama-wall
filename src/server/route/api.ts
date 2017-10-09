import * as express from "express";

import { checkout, restore } from "../db/pool";
import { Collection } from "../db/collection";
import { log, error } from "../../utils/log";

const router = express.Router();

//提供哦前端数据接口
router.route('/activity/:uid').get((req, res, next) => {
    //获取用户创建的活动
    res.json({'ok':true, data:[]})
}).post((req, res, next) => {
    //新建活动
    res.end('创建成功')
}).delete((req, res, next) => {
    //删除活动
    res.end('删除成功成功')
}).patch((req, res, next) => {
    //更新活动
    res.end('更新活动信息');
})

/**
 * api响应封装
 * @param res 请求响应
 * @param data 发送的json数据
 */
function response(res: IRespond, data: any): void {
    res.json(data);
}

export default router;