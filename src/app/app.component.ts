import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import {
  AuthenticatedResult,
  OidcSecurityService,
  UserDataResult,
} from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Logger } from './core/logging/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    MatMenuModule,
    MatToolbarModule,
    MatTooltipModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    AsyncPipe,
  ],
})
export class AppComponent {
  protected readonly authenticated: Signal<AuthenticatedResult>;
  protected readonly oidcUser: Signal<UserDataResult>;
  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #logger = new Logger('app.component');
  readonly #oidcSecurityService = inject(OidcSecurityService);
  readonly #router = inject(Router);

  constructor() {
    this.authenticated = this.#oidcSecurityService.authenticated;
    this.oidcUser = this.#oidcSecurityService.userData;
  }

  ngOnInit(): void {
    this.#oidcSecurityService
      .checkAuth()
      .subscribe(({ isAuthenticated, accessToken }) => {
        this.#logger.debug(`authenticated: ${isAuthenticated}`);
        this.#logger.info(`access token: ${accessToken}`);
      });
  }

  isHandset$: Observable<boolean> = this.#breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  isMatTooltipDisabled(): boolean {
    return false;
  }

  logoutOidc() {
    this.#logger.debug('start logoff (oidc logoff()');
    //this.oidcSecurityService.logoff().subscribe((result) => this.#logger.debug(result))
    this.#oidcSecurityService.logoffLocal();
    this.#router.navigateByUrl('');
    location.reload();
  }
}
