declare module "mysql-query-observable" {
  import Rx = require('rxjs/Rx')

  /**
   * Creates RxJS observable from SQL query
   */
  export function createObservableFromQuery<T>(query: string): Rx.Observable<T>
}
