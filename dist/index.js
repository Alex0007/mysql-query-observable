"use strict";
const pg = require("pg");
const rxjs_1 = require("rxjs");
const Debug = require("debug");
const debug = Debug('mysql-query-observable');
const noop = () => undefined;
const POOL_CREATION_TIMEOUT = process.env.PGCONNECT_TIMEOUT || 10000;
exports.createInstance = (connectionOptions) => {
    let poolClient;
    const poolClientInit = new Promise((resolve, reject) => {
        if (poolClient) {
            return resolve(poolClient);
        }
        if (!connectionOptions && !process.env.PGUSER) {
            console.warn('Not found connection settings');
            return;
        }
        const pool = new pg.Pool(Object.assign(connectionOptions ? connectionOptions : {}, {
            max: 100,
            idleTimeoutMillis: 500
        }));
        pool.connect((err, client) => {
            if (err)
                return reject(err);
            poolClient = client;
            resolve(poolClient);
        });
        setTimeout(() => reject(new Error('Pool creation timeout')), POOL_CREATION_TIMEOUT);
    });
    return (queryString) => {
        return rxjs_1.Observable
            .of(0)
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
};
exports.createObservableFromQuery = exports.createInstance();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.createObservableFromQuery;
