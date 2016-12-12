import {Observable} from 'rxjs'

export function createObservableFromQuery<T>(query: string): Observable<T>
