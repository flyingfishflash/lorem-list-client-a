import { BreakpointObserver } from '@angular/cdk/layout';
import { NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Logger } from './core/logging/logger.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    NgIf,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isAutosize = false;
  isCollapsed = true;
  isMobile = true;

  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #oidcSecurityService = inject(OidcSecurityService);
  readonly #router = inject(Router);
  readonly #logger = new Logger('app.component');
  protected authenticated = this.#oidcSecurityService.authenticated;
  protected oidcUser = this.#oidcSecurityService.userData;

  ngOnInit(): void {
    this.#breakpointObserver
      .observe(['(max-width: 800px)'])
      .subscribe((screenSize) => {
        if (screenSize.matches) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }
      });

    this.#oidcSecurityService
      .checkAuth()
      .subscribe(({ isAuthenticated, accessToken }) => {
        this.#logger.debug(`authenticated: ${isAuthenticated}`);
        this.#logger.info(`access token: ${accessToken}`);
      });
  }

  toggleMenu() {
    if (this.isMobile) {
      this.isAutosize = false;
      this.sidenav.toggle();
      this.isCollapsed = true;
    } else {
      this.isAutosize = true;
      setTimeout(() => (this.isAutosize = false), 1);
      this.sidenav.open();
      this.isCollapsed = !this.isCollapsed;
    }
  }

  isMatTooltipDisabled(): boolean {
    return !this.isCollapsed;
  }

  logoutOidc() {
    this.#logger.debug('start logoff (oidc logoff()');
    //this.oidcSecurityService.logoff().subscribe((result) => this.#logger.debug(result))
    this.#oidcSecurityService.logoffLocal();
    this.#router.navigateByUrl('');
    location.reload();
  }
}
