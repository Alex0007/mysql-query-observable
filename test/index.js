let test = require('ava')
let createObservableFromQuery = require('../dist/').default

test('test if basic query working', t => {
  return createObservableFromQuery(`
    SELECT * FROM item ORDER BY id ASC LIMIT 2
  `).toArray()
    .map(data => {
      t.is(data.length, 2, 'Correct number of items receieved')
      t.is(data[0].id, 85435, 'Correct item')
    })
    .catch(t.fail)
})
