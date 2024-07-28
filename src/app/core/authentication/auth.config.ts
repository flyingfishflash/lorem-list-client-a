import { LogLevel, PassedInitialConfig } from 'angular-auth-oidc-client';
import { environment } from '../../../environments/environment';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: environment.oidc.endpoint || 'default',
    clientId: environment.oidc.clientId || 'default',
    forbiddenRoute: '/forbidden',
    historyCleanupOff: true,
    logLevel: LogLevel.Debug,
    postLoginRoute: '/home',
    postLogoutRedirectUri: window.location.origin,
    redirectUrl: window.location.origin,
    renewTimeBeforeTokenExpiresInSeconds: 30,
    responseType: 'code',
    secureRoutes: [environment.api.server.url],
    scope: 'openid email profile offline_access' + ' ' + environment.oidc.scope,
    silentRenew: true,
    triggerAuthorizationResultEvent: true,
    unauthorizedRoute: '/unauthorized',
    useRefreshToken: true,
  },
    // authority: environment.oidc.endpoint || 'default',
    // clientId: environment.oidc.clientId || 'default',
    // forbiddenRoute: '/forbidden',
    // historyCleanupOff: true,
    // logLevel: LogLevel.Debug,
    // postLoginRoute: '/home',
    // postLogoutRedirectUri: window.location.origin,
    // redirectUrl: window.location.origin,
    // responseType: 'code',
    // scope: 'openid email profile offline_access' + ' ' + environment.oidc.scope,
    // silentRenew: true,
    // unauthorizedRoute: 'unauthorized',
    // useRefreshToken: true,
  }


