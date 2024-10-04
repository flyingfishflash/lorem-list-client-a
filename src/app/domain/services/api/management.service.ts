import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Logger } from '../../../core/shared/logging/logger';
import { domainApiRoutes } from '../../../domain/domain-config-routes';
import { ManagementHealth } from '../../model/management-health';
import { ManagementInfo } from '../../model/management-info';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {
  readonly http = inject(HttpClient);
  readonly #logger = new Logger('management.service');

  getHealth(): Observable<ManagementHealth> {
    return this.http.get<ManagementHealth>(
      environment.api.server.url + domainApiRoutes.managementHealth,
    );
  }

  getHealthStatusSimple(): Observable<boolean> {
    return this.http
      .get<ManagementHealth>(
        `${environment.api.server.url}${domainApiRoutes.managementHealth}`,
      )
      .pipe(
        map((managementHealth: { status: string }) => {
          this.#logger.debug(
            `${domainApiRoutes.managementHealth}: ${JSON.stringify(managementHealth)}`,
          );
          if (managementHealth.status == 'UP') {
            return true;
          } else {
            return false;
          }
        }),
      );
  }

  getInfo(): Observable<ManagementInfo> {
    return this.http
      .get<ManagementInfo>(
        `${environment.api.server.url}${domainApiRoutes.managementInfo}`,
      )
      .pipe(
        map((response) => {
          this.#logger.debug(
            `${domainApiRoutes.managementInfo}: ${JSON.stringify(response)}`,
          );
          return response;
        }),
      );
  }
}
