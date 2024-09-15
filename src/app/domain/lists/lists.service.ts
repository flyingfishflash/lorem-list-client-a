import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router'
import { catchError, map, Observable, throwError } from 'rxjs';
// import { catchError, map } from 'rxjs/operators'
import { environment } from '../../../environments/environment';
import { Logger } from '../../core/logging/logger.service';
import { DomainRoutes } from '../domain-config-routes';

// const log = new Logger('account.service');

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  readonly #logger = new Logger('lists.service');

  constructor(private http: HttpClient) {}


  getLists(): Observable<any> {
    const httpParams = new HttpParams().set('includeItems', 'false');

    return this.http
      .get<any>(`${environment.api.server.url}${DomainRoutes.LISTS}`, {
        params: httpParams,
      })
      .pipe(
        map((res) => {
          return res.content;
        }),
        catchError(this.handleError),
      );
  }

  getPublicLists(): Observable<any> {
    const httpParams = new HttpParams().set('includeItems', 'false');

    return this.http
      .get<any>(`${environment.api.server.url}${DomainRoutes.PUBLIC_LISTS}`, {
        params: httpParams,
      })
      .pipe(
        map((res) => {
          return res.content;
        }),
        catchError(this.handleError),
      );
  }



  //   getAccountCategories(): Observable<string[]> {
  //     return this.http
  //       .get<any>(`${environment.api.server.url}/account-categories`)
  //       .pipe(
  //         map((res) => {
  //           return res.content
  //         }),
  //         catchError(this.handleError),
  //       )
  //   }

  handleError(error: any) {
    this.#logger.info('zzzzzz');
    this.#logger.debug(`error: ${error}`);
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client internal error occurred:\nError Message: ${error.error.message}`;
    } else {
      errorMessage = `A server-side error occured:\nError Status: ${error.status}\nError Message: ${error.message}`;
    }
    this.#logger.error(errorMessage);
    return throwError(() => error);
  }
}
