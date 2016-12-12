"use strict";
const pg = require("pg");
const rxjs_1 = require("rxjs");
const Debug = require("debug");
const debug = Debug('mysql-query-observable');
const noop = () => undefined;
const pool = new pg.Pool({
    max: 100,
    idleTimeoutMillis: 500
});
const POOL_CREATION_TIMEOUT = process.env.PGCONNECT_TIMEOUT || 10000;
let poolClient;
const poolClientInit = new Promise((resolve, reject) => {
    if (poolClient) {
        return resolve(poolClient);
    }
    pool.connect((err, client) => {
        if (err)
            return reject(err);
        poolClient = client;
        resolve(poolClient);
    });
    setTimeout(() => reject(new Error('Pool creation timeout')), POOL_CREATION_TIMEOUT);
});
exports.createObservableFromQuery = (queryString) => {
    return rxjs_1.Observable.of(0)
        .flatMap(() => poolClientInit)
        .flatMap((client) => {
        return rxjs_1.Observable.create((o) => {
            if (!queryString) {
                return o.complete();
            }
            debug(`Executing query: ${queryString.substring(0, 300)}${queryString.length <= 300 ? '' : '...'}`);
            const query = client.query(queryString, (err) => {
                if (err)
                    o.error(err);
                o.complete();
            });
            query.on('row', (row) => o.next(row));
            // query.on('error', (err) => o.error(err))
            // query.on('end', () => o.complete())
            return noop;
        });
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.createObservableFromQuery;
