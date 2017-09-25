import { log, error } from '../../utils/log';
import { ports } from '../config/conf';

import { MongoClient as mongo } from "mongodb";

import { promisify } from "util";

const dburl = `mongodb://localhost:${ports.db}`;

const connect = async (col: string) => {
    let db = await promisify(mongo.connect)(`${dburl}/${col}`,{}).catch(reason => error('数据库链接失败',reason));
    if(db) {
        let collection = db.collection(col);
        return {db, collection};
    }
}

const insert = async (col: string, data: any) => {
    let db = await connect(col);
    if(db) {
        let {result} = await db.collection.insert({name:'samao',pwd:'samao'});
        if(result.ok) {
            log('完成');
        }else{
            error('失败');
        }
        db.db.close();
    }
}
const update = async (col: string, data: any) => {

}
const find = async (col: string, data?: any) => {
    let db = await connect(col);
     if(db) {
        let result = await db.collection.find(data).toArray();
        log('获取到得数组：',JSON.stringify(result));
        db.db.close();
    }
}
const remove = async (data: any) => {
    
}

export {insert, update, find, remove}
