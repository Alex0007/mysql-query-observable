import { Observable } from 'rxjs'
import { ConnectionConfig } from 'pg'

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
export function createInstance(options?: ConnectionConfig): QueryObservable<any>