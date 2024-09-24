import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { DomainRoutes } from '../../domain/domain-config-routes';
import { ErrorDialogService } from '../error-dialog/error-dialog.service';
import { Logger } from '../logging/logger.service';

const RETRY_TIMES = 0;
// const DELAY = 2_000;

export function errorInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> {
  const logger = new Logger('http-error.interceptor');
  const errorDialogService = inject(ErrorDialogService);
  return next(req).pipe(
    retry(RETRY_TIMES),
    // retry({ count: RETRY_TIMES, delay: (error) => shouldRetry(error) }),
    catchError((error) => {
      let errorMessage = 'An unexpected error has occurred.';
      logger.debug('intercepted error:', error);
      if (error instanceof HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
          errorMessage = `Client-side error: ${error.error.message}`;
        } else {
          const errorUrl: string = error.url == null ? '' : error.url;
          switch (error.status) {
            case 0:
              if (
                !errorUrl.includes(DomainRoutes.MANAGEMENT_HEALTH) &&
                !errorUrl.includes(DomainRoutes.MANAGEMENT_INFO)
              ) {
                errorDialogService.openDialog(
                  `${error.statusText} (${error.status})`,
                  'HTTP connection could not be established. API Server may not be reachable.',
                  error.status,
                  'HTTP Error',
                );
                break;
              } else {
                break;
              }
            default:
              errorDialogService.openDialog(
                error.error.content.title ?? error.status,
                error.error.content.detail ?? JSON.stringify(error),
                error.status,
                'Server Response Indicates an Error',
              );
              errorMessage = `HTTP error: ${error.status} - ${error.statusText}`;
          }
        }
      } else {
        logger.error(errorMessage);
      }
      return throwError(() => error);
    }),
  );
}

// function shouldRetry(error: HttpErrorResponse): Observable<number> | null {
//   if (error.status === HttpStatusCode.ServiceUnavailable) {
//     return timer(DELAY);
//   }
//   return null;
// }
