import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor, provideAuth } from 'angular-auth-oidc-client';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authConfig } from './core/authentication/auth.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor()])),
    provideAuth(authConfig),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
};
