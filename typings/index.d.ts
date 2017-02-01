import { Observable } from 'rxjs'

export interface ConnectionOptions {
  user: string
  pass: string
  host: string
  database: string
  port?: string | number
}

export type QueryObservable<T> = (query: string) => Observable<T>

/**
 * Executes SQL query and streams items one by one.
 * Uses environment vars to set up connection
 */
export function createObservableFromQuery<T>(query: string): Observable<T>

/**
 * Creates QueryObservable function from connection options provided.
 * If connection options are empty, then uses environment vars
 */
export function createInstance(options?: ConnectionOptions): QueryObservable<any>