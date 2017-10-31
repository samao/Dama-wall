import * as express from "express";
import * as QRCode from "qrcode";
import * as path from 'path';

import { checkout, restore, insert, IActivityDB, getAutoKey } from "../db/pool";
import { Collection } from "../db/collection";
import { log, error } from "../../utils/log";
import { HOST, ports } from "../config/conf";
import { success, failure } from "../../utils/feedback";

const router = express.Router();

router.route('/user/:uid').post((req, res, next) => {
    checkout(db => {
        const users = db.collection(Collection.USER);
        users.findOneAndUpdate({_id: +req.params.uid}, {$set: { isAdmin: req.body.checked === 'true' }}, (err, result) => {
            if(err) {
                error('写入更新失败',err)
            }
        })
        success(res, '更新用户信息成功')
    }, reason => failure(res, `user 接口无法连接数据库`))
})

//提供哦前端数据接口
router.route('/activity/:rid').all((req, res,next) => {
    //分权限
    log(`本次rid: ${req.params.rid}`)
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
        const actTable = db.collection(Collection.ACTIVITY)
        getAutoKey(Collection.ACTIVITY).then(_id => {
            insert<IActivityDB>(actTable,{_id, rid: req.params.rid}).then(() => {
                log('活动信息成功写入数据库')
                //2.生成二维码文件
                const QRPath = path.resolve('public','images','qr',`${req.params.rid}.png`);
                const QRData = `${HOST}/danmu/${req.params.rid}`;
                
                log('二维码存储地址',QRPath);
                log('二维码内容',QRData);
    
                QRCode.toFile(QRPath, QRData, err => {
                    if(err)
                        failure(res, `生成二维码失败 ${err.message}`);
                    else
                        success(res, `${HOST}:${ports.web}/qr/${req.params.rid}`);
                });
            },({errmsg:reason}) => {
                failure(res, `活动名称已经存在 ${req.params.rid}`)
            }).then(() => {
                restore(db);
            });
        }, reason => failure(res, `获取id生成错误 ${reason}`))
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
        }).then(() => restore(db));
    }, reason => {
        failure(res, `无法连接数据库 ${req.params.rid}`)
    })
}

function patchAct(): void {
    //1.更新活动数据库
}

export default router;