import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, take } from 'rxjs/operators';
import { AuthCallbackComponent } from './core/routes/auth-callback/auth-callback.component';
import { domainRoutes } from './domain/domain-config-routes';

export const isAuthenticatedGuard = () => {
  const oidcSecurityService = inject(OidcSecurityService);

  return oidcSecurityService.isAuthenticated$.pipe(
    take(1),
    map(({ isAuthenticated }) => {
      if (!isAuthenticated) {
        console.log('isAuthenticatedGuard: not authenticated');
        return false;
      }
      console.log('isAuthenticatedGuard: authenticated');
      return true;
    }),
  );
};

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'auth/callback', component: AuthCallbackComponent },
  {
    path: 'home',
    loadComponent: () =>
      import('./domain/routes/home/home.component').then(
        (m) => m.HomeComponent,
      ),
  },
  {
    path: domainRoutes.listsManage,
    loadComponent: () =>
      import('./domain/routes/lists-manage/lists-manage.component').then(
        (m) => m.ListsManageComponent,
      ),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: domainRoutes.listCreate,
    loadComponent: () =>
      import('./domain/routes/list-create/list-create.component').then(
        (m) => m.ListCreateComponent,
      ),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: domainRoutes.itemsManage,
    loadComponent: () =>
      import('./domain/routes/items-manage/items-manage.component').then(
        (m) => m.ItemsManageComponent,
      ),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: domainRoutes.itemCreate,
    loadComponent: () =>
      import('./domain/routes/item-create/item-create.component').then(
        (m) => m.ItemCreateComponent,
      ),
    canActivate: [isAuthenticatedGuard],
  },
];
