import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BuildProperties } from './app-build-properties';
import { Logger } from './core/logging/logger.service';

export interface IBuildProperties extends AppConfigRuntime {
  buildProperties: BuildProperties;

  load: () => Observable<AppConfigRuntime>;
}

@Injectable()
export class AppConfigRuntime implements IBuildProperties {
  public buildProperties: BuildProperties = {
    artifact: 'default',
    ciPipelineId: '',
    ciPlatform: 'default',
    commit: 'default',
    group: 'default',
    name: 'default',
    time: 'default',
    version: 'default',
  };

  readonly #logger = new Logger('app-config-runtime');

  constructor(private readonly http: HttpClient) {}

  public load(): Observable<AppConfigRuntime> {
    return this.http.get('/assets/buildProperties.json').pipe(
      map((discoveredBuildProperties: any) => {
        this.buildProperties = discoveredBuildProperties;
        return discoveredBuildProperties;
      }),
      catchError((err) => {
        this.handleError(err);
        return EMPTY;
      }),
    );
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client internal error occurred:\nError Message: ${error.error.message}`;
    } else if (error instanceof TypeError) {
      errorMessage = `A client internal error occurred:\nError Message: ${error.message}`;
    } else if (error instanceof HttpErrorResponse) {
      errorMessage = `A server-side error occured:\nError Status: ${error.status}\nError Message: ${error.message}`;
    } else {
      errorMessage = 'An error of an unknown type occured:';
      this.#logger.error(error);
    }
    this.#logger.error(errorMessage);
  }
}
