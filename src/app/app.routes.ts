import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, take } from 'rxjs/operators';
import { CallbackComponent } from './core/authentication/callback/callback.component';
import { DomainRoutes } from './domain/domain-config-routes';

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
  { path: 'auth/callback', component: CallbackComponent },
  {
    path: 'home',
    loadComponent: () =>
      import('./core/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'lists',
    loadComponent: () =>
      import('./domain/lists/lists.component').then((m) => m.ListsComponent),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: DomainRoutes.LIST_CREATE,
    loadComponent: () =>
      import('./domain/list-create/list-create.component').then(
        (m) => m.ListCreateComponent,
      ),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'items',
    loadComponent: () =>
      import('./domain/items/items.component').then((m) => m.ItemsComponent),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: DomainRoutes.ITEM_CREATE,
    loadComponent: () =>
      import('./domain/item-create/item-create.component').then(
        (m) => m.ItemCreateComponent,
      ),
    canActivate: [isAuthenticatedGuard],
  },
];
