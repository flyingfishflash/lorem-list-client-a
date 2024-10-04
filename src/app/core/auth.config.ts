import { PassedInitialConfig } from 'angular-auth-oidc-client';
import { environment } from '../../environments/environment';
import { domainRoutes } from '../domain/domain-config-routes';

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
      environment.api.server.url + domainRoutes.itemCreate,
      environment.api.server.url + domainRoutes.itemsManage,
      environment.api.server.url + domainRoutes.listCreate,
      environment.api.server.url + domainRoutes.listsManage,
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
