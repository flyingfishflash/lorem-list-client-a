import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Logger } from '../../../core/shared/logging/logger';
import { domainApiRoutes } from '../../domain-config-routes';
import { ItemCreateRequest } from '../../model/item-create-request';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  readonly #logger = new Logger('items.service');
  readonly #http = inject(HttpClient);

  getLists(): Observable<any> {
    const httpParams = new HttpParams().set('includeItems', 'false');

    return this.#http
      .get<any>(`${environment.api.server.url}${domainApiRoutes.items}`, {
        params: httpParams,
      })
      .pipe(
        map((res) => {
          return res.content;
        }),
        catchError((err) => {
          this.#logger.debug('getItems()', err);
          return throwError(() => err);
        }),
      );
  }

  postItem(postData: ItemCreateRequest): Observable<string> {
    postData.name = postData.name.trim();
    postData.description = postData.description?.trim() ?? null;

    return this.#http
      .post<any>(
        `${environment.api.server.url}${domainApiRoutes.items}`,
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
}
