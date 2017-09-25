import { MongoClient as mongo, Db } from "mongodb";
import { log, error } from '../../utils/log';
import { ports } from '../config/conf';

import { promisify } from "util";

import { EventEmitter as Emit } from "events";

const MAX_CONNECTIONS = 8;

const DB_NAME = 'dama'

const dburl = `mongodb://localhost:${ports.db}/${DB_NAME}`;

const connect = () => {
    return promisify(mongo.connect)(`${dburl}`,{});
}

class DbControler extends Emit {

    private _dbs: Db[] = [];

    private _dbinUsed: Db[] = [];

    private static _instance: DbControler;

    static getInstance(): DbControler {
        if(!DbControler._instance) {
            DbControler._instance = new DbControler();
        }
        return DbControler._instance;
    }

    async createConnector() {
        for(let i = 0; i < MAX_CONNECTIONS; ++i) {
            this._dbs.push(await connect())
        }
        this.emit(Event.CREATED,this._dbs);
    }

    getDB(cb: (db:Db) =>void): void {
        
    }
}

enum Event {
    CREATED = 'created'
}

export default DbControler.getInstance();