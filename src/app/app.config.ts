import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideNoopAnimations } from '@angular/platform-browser/animations'
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router'
import { authInterceptor, provideAuth } from 'angular-auth-oidc-client'
import { routes } from './app.routes'
import { authConfig } from './core/authentication/auth.config'

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor()])),
    provideAuth(authConfig),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideNoopAnimations(),
  ],
}
