import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Logger } from '../../../core/shared/logging/logger';
import { domainApiRoutes } from '../../domain-config-routes';
import { LrmList } from '../../model/lrm-list';

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  readonly #logger = new Logger('public.service');
  readonly #http = inject(HttpClient);

  getPublicLists(): Observable<LrmList[]> {
    const httpParams = new HttpParams().set('includeItems', 'false');
    return this.#http
      .get<any>(`${environment.api.server.url}${domainApiRoutes.publicLists}`, {
        params: httpParams,
      })
      .pipe(
        map((apiResponse) => {
          this.#logger.debug('getPublicLists()', apiResponse);
          return apiResponse.content;
        }),
        catchError((error) => {
          this.#logger.debug('getPublicLists()', error);
          return throwError(() => error);
        }),
      );
  }
}
