import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DomainRoutes } from '../../domain/domain-config-routes';
import { Logger } from '../logging/logger.service';
import { ManagementHealth } from './management-health';
import { ManagementInfo } from './management-info';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {
  readonly http = inject(HttpClient);
  readonly #logger = new Logger('management.service');

  getHealth(): Observable<ManagementHealth> {
    return this.http.get<ManagementHealth>(
      environment.api.server.url + DomainRoutes.MANAGEMENT_HEALTH,
    );
  }

  getHealthStatusSimple(): Observable<boolean> {
    return this.http
      .get<ManagementHealth>(
        `${environment.api.server.url}${DomainRoutes.MANAGEMENT_HEALTH}`,
      )
      .pipe(
        map((managementHealth: { status: string }) => {
          this.#logger.debug(
            `${DomainRoutes.MANAGEMENT_HEALTH}: ${JSON.stringify(managementHealth)}`,
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
        `${environment.api.server.url}${DomainRoutes.MANAGEMENT_INFO}`,
      )
      .pipe(
        map((response) => {
          this.#logger.debug(
            `${DomainRoutes.MANAGEMENT_INFO}: ${JSON.stringify(response)}`,
          );
          return response;
        }),
      );
  }
}
