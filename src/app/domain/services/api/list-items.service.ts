import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Logger } from '../../../core/shared/logging/logger';
import { domainApiRoutes } from '../../domain-config-routes';
import { ItemCreateRequest } from '../../model/item-create-request';
// import { LrmList } from '../../model/lrm-list';
import { LrmListItem } from '../../model/lrm-list-item';
import { LrmListItemPatchRequest } from '../../model/lrm-list-item-patch-request';

@Injectable({
  providedIn: 'root',
})
export class ListItemsService {
  readonly #logger = new Logger('items.service');
  readonly #http = inject(HttpClient);

  // getLists(): Observable<any> {
  //   const httpParams = new HttpParams().set('includeItems', 'false');

  //   return this.#http
  //     .get<any>(`${environment.api.server.url}${domainApiRoutes.items}`, {
  //       params: httpParams,
  //     })
  //     .pipe(
  //       map((res) => {
  //         return res.content;
  //       }),
  //       catchError((err) => {
  //         this.#logger.debug('getItems()', err);
  //         return throwError(() => err);
  //       }),
  //     );
  // }

  postItem(listId: string, postData: ItemCreateRequest): Observable<string> {
    postData.name = postData.name.trim();
    postData.description = postData.description?.trim() ?? null;
    postData.quantity = postData.quantity ?? 0;

    return this.#http
      .post<any>(
        `${environment.api.server.url}${domainApiRoutes.lists}/${listId}/items`,
        postData,
      )
      .pipe(
        map((response: any) => {
          this.#logger.debug('api response: ', response);
          return response.message;
        }),
        catchError((err) => {
          this.#logger.debug('postItem()', err);
          return throwError(() => err);
        }),
      );
  }

  deleteItem(listId: string, itemId: string): Observable<any> {
    return this.#http
      .delete(
        `${environment.api.server.url}${domainApiRoutes.lists}/${listId}/items/${itemId}`,
      )
      .pipe(
        map((apiResponse: any) => {
          this.#logger.debug('deleteItem())', apiResponse);
          return apiResponse;
        }),
        catchError((error) => {
          this.#logger.debug('deleteItem()', error);
          return throwError(() => error);
        }),
      );
  }

  deleteItems(listId: string): Observable<any> {
    return this.#http
      .delete(
        `${environment.api.server.url}${domainApiRoutes.lists}/${listId}/items`,
      )
      .pipe(
        map((apiResponse: any) => {
          this.#logger.debug('deleteItems()', apiResponse);
          return apiResponse;
        }),
        catchError((error) => {
          this.#logger.debug('deleteItems()', error);
          return throwError(() => error);
        }),
      );
  }

  patchListItem(
    listId: string,
    itemId: string,
    patchData: LrmListItemPatchRequest,
  ): Observable<LrmListItem> {
    this.#logger.debug('patchData', patchData);
    return this.#http
      .patch<any>(
        `${environment.api.server.url}${domainApiRoutes.lists}/${listId}/items/${itemId}`,
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
}
