import { log, error } from '../../utils/log';
import { ports } from '../config/conf';

import { MongoClient as mongo } from "mongodb";

import { promisify } from "util";

const dburl = `mongodb://localhost:${ports.db}/dama`;

const connect = () => {
    return promisify(mongo.connect)(`${dburl}`,{});
}

const insert = async (col: string, data: any) => {
    let db = await connect();
    let collection = db.collection(col);
    collection.insert(data,(err,data) => {
        if(err) { 
            db.close(); 
            return
        }
        db.close();
    })
}
const update = async (col: string, query:any, data: any,options:{upsert:boolean, multi: boolean} = {upsert:false, multi: false}) => {
    let db = await connect();
    let collection = db.collection(col);
    collection.update(query, data, options);
    db.close();
}
const find = async (col: string, data?: any) => {
    let db = await connect();
    let collection = db.collection(col);
    let origin = await promisify(collection.find(data).toArray)
    return origin;
}
const remove = async (type: string, query: any, options:{single:boolean} = {single: false}) => {
    let db = await connect();
    let collection = db.collection(type);
    collection.remove(query,(err) => {
        if(err) { 
            db.close(); 
            return
        }
        db.close();
    })
}

export {insert, update, find, remove}
