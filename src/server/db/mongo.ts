import { log, error } from '../../utils/log';
import { ports } from '../config/conf';

import { MongoClient as mongo } from "mongodb";

import { promisify } from "util";

const dburl = `mongodb://localhost:${ports.db}/dama`;

const connect = async () => {
   return await promisify(mongo.connect)(dburl,{}).catch(reason => error('数据库链接失败',reason));
}

const insert = async (data:any) => {
    let db = await connect();
    if(db) {
        log('数据库链接成功');
        db.close();
    }
}
const update = async (data: any) => {

}
const find = async (data: any) => {
    
}
const remove = async (data: any) => {
    
}
export {insert, update, find, remove}
