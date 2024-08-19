import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Observable, map, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ManagementHealth } from './management-health';
// import { ManagementInfo } from './management-info';
import { map, Observable } from 'rxjs';
import { DomainRoutes } from '../../domain/domain-config-routes';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {
  constructor(private http: HttpClient) {}

  getHealth(): Observable<ManagementHealth> {
    return this.http.get<ManagementHealth>(
      environment.api.server.url + DomainRoutes.MANAGEMENT_HEALTH,
    );
  }

  getHealthStatusSimple(): Observable<boolean> {
    return this.http
      .get<ManagementHealth>(`${environment.api.server.url}${DomainRoutes.MANAGEMENT_HEALTH}`)
      .pipe(
        map((managementHealth: { status: string }) => {
          if (managementHealth.status == 'UP') {
            return true;
          } else {
            return false;
          }
        }),
      );
  }

  getInfo(): Observable<any> {
    return this.http.get<any>(`${environment.api.server.url}${DomainRoutes.MANAGEMENT_HEALTH}`);
    //     return this.http
    //       .get<ManagementInfo>(environment.api.server.url + '/management/info')
    //       .pipe(
    //         map((managementInfo) => {
    //             console.log(managementInfo)
    //         }),

    //         catchError((error) => throwError(() => error)));
    //   }
  }
}
