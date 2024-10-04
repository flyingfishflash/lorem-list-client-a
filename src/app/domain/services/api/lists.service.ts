import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Logger } from '../../../core/shared/logging/logger';
import { domainApiRoutes } from '../../domain-config-routes';
import { ListCreateRequest } from '../../model/list-create-request';

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  readonly #logger = new Logger('lists.service');
  readonly #http = inject(HttpClient);

  getLists(): Observable<any> {
    const httpParams = new HttpParams().set('includeItems', 'false');

    return this.#http
      .get<any>(`${environment.api.server.url}${domainApiRoutes.lists}`, {
        params: httpParams,
      })
      .pipe(
        map((res) => {
          return res.content;
        }),
        catchError((err) => {
          this.#logger.debug('getLists()', err);
          return throwError(() => err);
        }),
      );
  }

  getPublicLists(): Observable<any> {
    const httpParams = new HttpParams().set('includeItems', 'false');

    return this.#http
      .get<any>(`${environment.api.server.url}${domainApiRoutes.publicLists}`, {
        params: httpParams,
      })
      .pipe(
        map((res) => {
          return res.content;
        }),
        catchError((err) => {
          this.#logger.debug('getPublicLists()', err);
          return throwError(() => err);
        }),
      );
  }

  postList(postData: ListCreateRequest): Observable<string> {
    postData.name = postData.name.trim();
    postData.description = postData.description?.trim() ?? null;

    return this.#http
      .post<any>(
        `${environment.api.server.url}${domainApiRoutes.lists}`,
        postData,
      )
      .pipe(
        map((response: any) => {
          this.#logger.debug('api response: ', response);
          return response.message;
        }),
        catchError((err) => {
          this.#logger.debug('postList()', err);
          return throwError(() => err);
        }),
      );
  }
}
