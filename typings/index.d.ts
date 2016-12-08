import * as Rx from 'rxjs/Rx'

/**
 * Creates RxJS observable from SQL query
 */
export interface createObservableFromQuery<T> {
  (query: string): Rx.Observable<T>
}

declare module 'mysql-query-observable' {
  export = createObservableFromQuery
}
