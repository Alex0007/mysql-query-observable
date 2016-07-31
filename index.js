/**
 * Function that returns cancelable Rx stream with MySQL query results
 */

let pg = require('pg')
let Rx = require('rx')
let debug = require('debug')('mysql-query-observable')

let pool = new pg.Pool({
  max: 100,
  idleTimeoutMillis: 500
})

const POOL_CREATION_TIMEOUT = process.env.PGCONNECT_TIMEOUT || 10000

let poolClient = null
let creatingPool = false

let createPoolClient = () => new Promise((resolve, reject) => {
  setTimeout(() => reject('Pool creation timeout'), POOL_CREATION_TIMEOUT)

  if (poolClient) return resolve(poolClient)

  if (creatingPool) {
    let interval = setInterval(() => {
      if (poolClient) {
        resolve(poolClient)
        clearInterval(interval)
      }
    }, 300)
  }

  if (!poolClient && !creatingPool) {
    creatingPool = true

    pool.connect((err, client, done) => {
      if (err) return reject(err)
      poolClient = client
      creatingPool = false
      resolve(poolClient)
    })
  }
})

module.exports = (queryString) => Rx.Observable
  .just(1)
  .flatMap(() => createPoolClient())
  .flatMap(client => Rx.Observable.create(o => {
    let nextCalled = false // https://github.com/ReactiveX/RxJava/issues/3613

    let done = () => {
      if (!nextCalled) o.onNext(null)
      o.onCompleted()
    }

    if (!queryString) return done()

    debug(`Executing query: ${queryString.substring(0, 300)}${queryString.length <= 300 ? '' : '...'}`)

    let query = client.query(queryString)

    query.on('row', row => {
      nextCalled = true
      o.onNext(row)
    })

    query.on('error', err => o.onError(err))

    query.on('end', () => done())

    return () => {} // client.cancel(query) /* Non-native pg version continues executing till the end */
  }))
