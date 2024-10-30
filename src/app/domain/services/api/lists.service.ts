import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Logger } from '../../../core/shared/logging/logger';
import { domainApiRoutes } from '../../domain-config-routes';
import { ListCreateRequest } from '../../model/list-create-request';
import { LrmList } from '../../model/lrm-list';
import { LrmListPatchRequest } from '../../model/lrm-list-patch-request';

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  readonly #logger = new Logger('lists.service');
  readonly #http = inject(HttpClient);

  deleteEmptyList(id: string): Observable<LrmList[]> {
    return this.#deleteList(id, false);
  }

  deleteListAndItemAssociations(id: string): Observable<LrmList[]> {
    return this.#deleteList(id, true);
  }

  #deleteList(
    id: string,
    removeItemAssociations: boolean,
  ): Observable<LrmList[]> {
    const httpParams = new HttpParams().set(
      'removeItemAssociations',
      removeItemAssociations,
    );
    return this.#http
      .delete<any>(
        `${environment.api.server.url}${domainApiRoutes.lists}/${id}`,
        {
          params: httpParams,
        },
      )
      .pipe(
        map((apiResponse) => {
          this.#logger.debug('deleteList()', apiResponse);
          return apiResponse.content;
        }),
        catchError((error) => {
          this.#logger.debug('deleteList()', error);
          return throwError(() => error);
        }),
      );
  }

  deleteLists(): Observable<any> {
    return this.#http
      .delete<any>(`${environment.api.server.url}${domainApiRoutes.lists}`)
      .pipe(
        map((apiResponse) => {
          this.#logger.debug('deleteLists()', apiResponse);
          return apiResponse.content;
        }),
        catchError((error) => {
          this.#logger.debug('deleteLists()', error);
          return throwError(() => error);
        }),
      );
  }

  getLists(): Observable<LrmList[]> {
    const httpParams = new HttpParams().set('includeItems', 'false');
    return this.#http
      .get<any>(`${environment.api.server.url}${domainApiRoutes.lists}`, {
        params: httpParams,
      })
      .pipe(
        map((apiResponse) => {
          this.#logger.debug('getLists()', apiResponse);
          return apiResponse.content;
        }),
        catchError((error) => {
          this.#logger.debug('getLists()', error);
          return throwError(() => error);
        }),
      );
  }

  getListsCount(): Observable<number> {
    return this.#http
      .get<any>(`${environment.api.server.url}${domainApiRoutes.listsCount}`)
      .pipe(
        map((apiResponse: any) => {
          this.#logger.debug('getListsCount()', apiResponse);
          return apiResponse.content.value;
        }),
        catchError((error) => {
          this.#logger.debug('getListsCount()', error);
          return throwError(() => error);
        }),
      );
  }

  getListItemsCount(id: string): Observable<number> {
    return this.#http
      .get<any>(
        `${environment.api.server.url}${domainApiRoutes.lists}/${id}/items/count`,
      )
      .pipe(
        map((apiResponse: any) => {
          this.#logger.debug('getListItemsCount()', apiResponse);
          return apiResponse.content.value;
        }),
        catchError((error) => {
          this.#logger.debug('getListItemsCount()', error);
          return throwError(() => error);
        }),
      );
  }

  patchList(id: string, patchData: LrmListPatchRequest): Observable<LrmList> {
    this.#logger.debug('patchData', patchData);
    return this.#http
      .patch<any>(
        `${environment.api.server.url}${domainApiRoutes.lists}/${id}`,
        patchData,
      )
      .pipe(
        map((apiResponse: any) => {
          this.#logger.debug('patchList()', apiResponse);
          return apiResponse.content;
        }),
        catchError((error) => {
          this.#logger.debug('patchList()', error);
          return throwError(() => error);
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
        map((apiResponse: any) => {
          this.#logger.debug('postList()', apiResponse);
          return apiResponse.message;
        }),
        catchError((error) => {
          this.#logger.debug('postList()', error);
          return throwError(() => error);
        }),
      );
  }
}
