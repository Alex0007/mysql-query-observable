let test = require('ava')
let createObservableFromQuery = require('../')

test.cb('test if basic query working', t => {
  createObservableFromQuery(`
    SELECT * FROM item ORDER BY id ASC LIMIT 2
  `).toArray()
    .do(data => {
      t.is(data.length, 2, 'Correct number of items receieved')
      t.is(data[0].id, 85435, 'Correct item')
      t.end()
    })
    .subscribe()
})
