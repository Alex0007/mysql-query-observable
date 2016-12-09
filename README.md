# mysql-query-observable
[![npm version](https://badge.fury.io/js/mysql-query-observable.svg)](https://badge.fury.io/js/mysql-query-observable) [![wercker status](https://app.wercker.com/status/84e014aa4dec0b56ee7222c9fda64498/s/master "wercker status")](https://app.wercker.com/project/bykey/84e014aa4dec0b56ee7222c9fda64498)

> Creates Rx observable from query

 - Uses pooling
 - Requires [pgsql environment variables](https://www.postgresql.org/docs/8.4/static/libpq-envars.html) to be set

### Example
```console
$ npm install --save mysql-query-observable
```

```js
import {createObservableFromQuery} from 'mysql-query-observable'

createObservableFromQuery(`
  SELECT * FROM item ORDER BY id ASC LIMIT 2
`)
.toArray()
.subscribe(data => console.log(data)) // [{item1}, {item2}]
```
