import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
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
    provideAppInitializer(() => {
      const initializerFn = appInitializerFn(inject(AppConfigRuntime));
      return initializerFn();
    }),
    provideAppInitializer(() => {
      const initializerFn = ((iconRegistry: MatIconRegistry) => () => {
        const defaultFontSetClasses = iconRegistry.getDefaultFontSetClass();
        const outlinedFontSetClasses = defaultFontSetClasses
          .filter((fontSetClass) => fontSetClass !== 'material-icons')
          .concat(['material-symbols-rounded']);
        iconRegistry.setDefaultFontSetClass(...outlinedFontSetClasses);
      })(inject(MatIconRegistry));
      return initializerFn();
    }),
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
