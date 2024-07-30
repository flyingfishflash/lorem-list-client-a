import { Routes } from '@angular/router'
import { CallbackComponent } from './core/authentication/callback/callback.component'
import { HomeComponent } from './core/home/home.component'

// import { inject } from '@angular/core'
// import { Router } from '@angular/router'
// import { OidcSecurityService } from 'angular-auth-oidc-client'
// import { map, take } from 'rxjs/operators'

// export const isAuthenticatedGuard = () => {
//   const oidcSecurityService = inject(OidcSecurityService)
//   // const router = inject(Router)

//   return oidcSecurityService.isAuthenticated$.pipe(
//     take(1),
//     map(({ isAuthenticated }) => {
//       if (!isAuthenticated) {
//         console.log(
//           'isAuthenticatedGuard: not authenticated',
//         )
//         // router.navigate(['/login'])
//         return false
//       }
//       console.log('isAuthenticatedGuard: authenticated')
//       return true
//     }),
//   )
// }

export const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'auth/callback', component: CallbackComponent },
  {
    path: 'home',
    component: HomeComponent,
    // canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./core/login/login.component').then((m) => m.LoginComponent),
  },
]
