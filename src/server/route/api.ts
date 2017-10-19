import * as express from "express";
import * as QRCode from "qrcode";
import * as path from 'path';
import { createWriteStream } from "fs";

import { checkout, restore } from "../db/pool";
import { Collection } from "../db/collection";
import { log, error } from "../../utils/log";
import { HOST } from "../config/conf";
import { success, failure } from "../../utils/feedback";

const router = express.Router();

//提供哦前端数据接口
router.route('/activity/:rid').all((req, res,next) => {
    //分权限
    next();
}).post((req, res, next) => {
    //新建活动
    createAct(req, res);
}).delete((req, res, next) => {
    //删除活动
    deleteAct(req, res);
}).patch((req, res, next) => {
    //更新活动
    res.end('更新活动信息');
})

/**
 * 生成活动二维码
 * @param req 
 * @param res 
 */
function createAct(req:IRequest, res:IRespond): void {
    //1.活动写入数据库
    checkout(db => {
        db.collection(Collection.ACTIVITY).insert({rid:req.params.rid}).then(result => {
            log('写入数据库成功',JSON.stringify(result))
            //2.生成二维码文件
            const QRStream = createWriteStream(path.resolve('public','images','qr',`${req.params.rid}.png`));
            QRCode.toFileStream(QRStream,`${HOST}/danmu/${req.params.rid}`, err => {
                if(err) {
                    failure(res, `生成二维码失败 ${err}`)
                }else{
                    success(res);
                }
            })
        },({errmsg:reason}) => {
            failure(res, `活动名称已经存在 ${req.params.rid}`)
        });
    }, reason => {
        failure(res, `无法连接数据库 ${req.params.rid}`)
    })
}

function deleteAct(req:IRequest, res:IRespond): void {
    //1.删除活动数据库
    checkout(db => {
        db.collection(Collection.ACTIVITY).deleteOne({rid: req.params.rid}).then(() => {
            //活动删除成功
            success(res);
        }, reason => {
            failure(res, `删除活动失败 ${reason}`)
        })
    }, reason => {
        failure(res, `无法连接数据库 ${req.params.rid}`)
    })
}

function patchAct(): void {
    //1.更新活动数据库
}

export default router;