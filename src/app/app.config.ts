import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import {
  AuthInterceptor,
  authInterceptor,
  provideAuth,
} from 'angular-auth-oidc-client';
import { Observable } from 'rxjs/internal/Observable';
import { AppConfigRuntime } from './app-config-runtime';
import { routes } from './app.routes';
import { authConfig } from './core/auth.config';
import { errorInterceptor } from './core/interceptors/http-error.interceptor';
import { LogLevel } from './core/model/loglevel.enum';
import { MIN_LOG_LEVEL } from './core/shared/logging/logger';

const appInitializerFn = (
  config: AppConfigRuntime,
): (() => Observable<AppConfigRuntime>) => {
  return () => config.load();
};

export const appConfig: ApplicationConfig = {
  providers: [
    AppConfigRuntime,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      deps: [AppConfigRuntime],
      multi: true,
    },
    {
      provide: MIN_LOG_LEVEL,
      useValue: isDevMode() ? LogLevel.DEBUG : LogLevel.INFO,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideHttpClient(withInterceptors([authInterceptor(), errorInterceptor])),
    provideAuth(authConfig),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideNoopAnimations(),
  ],
};
