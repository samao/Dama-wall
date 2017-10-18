import * as express from "express";
import * as QRCode from "qrcode";
import * as path from 'path';
import { createWriteStream } from "fs";

import { checkout, restore } from "../db/pool";
import { Collection } from "../db/collection";
import { log, error } from "../../utils/log";
import { HOST } from "../config/conf";

const router = express.Router();

//提供哦前端数据接口
router.route('/activity/:rid').all((req, res,next) => {
    //分权限
    next();
}).get((req, res, next) => {
    //获取用户创建的活动
    getAct(req, res);
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

function getAct(req:IRequest, res:IRespond): void {
    checkout(db => {
        db.collection(Collection.ACTIVITY).findOne({rid:req.params.rid}).then(data => {
            if(data) {
                res.sendFile(path.resolve('public', 'images', 'qr', `${req.params.rid}.png`))
            }else {
                res.json({ok:false, reason:'不存在的活动'})
            }
        }, reason => {
            error(reason)
            res.json({ok:false, reason:'查询数据库活动错误'})
        })
    }, reason => {
        error(reason)
        res.json({ok:false, reason:'无法连接数据库'})
    })
}

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
                    error(`生成二维码失败 ${err}`);
                    res.json({ok:false,reason:err});
                }else{
                    res.json({ok:true});
                }
            })
        },({errmsg:reason}) => {
            error(`写入数据库失败${reason}`);
            res.json({ok:false, reason:'活动名称已经存在'})
        });
    }, reason => {
        res.json({ok:false, reason});
    })
}

function deleteAct(req:IRequest, res:IRespond): void {
    //1.删除活动数据库
    checkout(db => {
        db.collection(Collection.ACTIVITY).deleteOne({rid: req.params.rid}).then(() => {
            //活动删除成功
            res.json({ok:true});
        }, reason => {
            error(`删除活动失败 ${reason}`)
        })
    }, reason => {
        error('无法连接数据库');
        res.json({ok:false,reason});
    })
}

function patchAct(): void {
    //1.更新活动数据库
}

/**
 * api响应封装
 * @param res 请求响应
 * @param data 发送的json数据
 */
function response(res: IRespond, data: any): void {
    res.json(data);
}

export default router;