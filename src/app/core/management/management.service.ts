import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ManagementHealth } from './management-health';
import { ManagementInfo } from './management-info';

@Injectable({
  providedIn: 'root',
})
export class ActuatorService {
  constructor(private http: HttpClient) {}

  getHealth(): Observable<ManagementHealth> {
    return this.http.get<ManagementHealth>(
      environment.api.server.url + '/management/health',
    );
  }

  getHealthStatusSimple(): Observable<boolean> {
    return this.http
      .get<ManagementHealth>(environment.api.server.url + '/management/health')
      .pipe(
        map((actuatorHealth) => {
          if (actuatorHealth.status == 'UP') {
            return true;
          } else {
            return false;
          }
        }),
      );
  }

  getInfo(): Observable<ManagementInfo> {
    return this.http
      .get<ManagementInfo>(environment.api.server.url + '/management/info')
      .pipe(catchError((error) => throwError(() => error)));
  }
}
