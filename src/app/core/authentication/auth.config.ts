import { PassedInitialConfig } from 'angular-auth-oidc-client';
import { environment } from '../../../environments/environment';
import { DomainRoutes } from '../../domain/domain-config-routes';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: environment.oidc.endpoint || 'default',
    clientId: environment.oidc.clientId || 'default',
    forbiddenRoute: '/forbidden',
    historyCleanupOff: true,
    // logLevel: LogLevel.Debug,
    postLoginRoute: '/home',
    postLogoutRedirectUri: window.location.origin + '/home',
    redirectUrl: window.location.origin + '/auth/callback',
    renewTimeBeforeTokenExpiresInSeconds: 30,
    responseType: 'code',
    secureRoutes: [
      environment.api.server.url + DomainRoutes.ITEMS,
      environment.api.server.url + DomainRoutes.LISTS,
      environment.api.server.url + '/maintenance',
    ],
    scope: 'openid email profile offline_access' + ' ' + environment.oidc.scope,
    silentRenew: true,
    triggerAuthorizationResultEvent: false,
    unauthorizedRoute: '/unauthorized',
    useRefreshToken: true,
    tokenRefreshInSeconds: 10,
  },
};
