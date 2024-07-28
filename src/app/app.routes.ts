import { Routes } from '@angular/router'
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client'
import { HomeComponent } from './core/home/home.component'
import { ProtectedComponent } from './core/protected/protected.component'

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  // { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [autoLoginPartialRoutesGuard],
  },
]
