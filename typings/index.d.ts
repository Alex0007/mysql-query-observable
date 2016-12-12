import {Observable} from 'rxjs'

declare module 'mysql-query-observable' {

  /**
   * Creates RxJS observable from SQL query
   */
  export function createObservableFromQuery<T>(query: string): Observable<T>
}
