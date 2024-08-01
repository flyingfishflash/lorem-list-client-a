import { BreakpointObserver } from '@angular/cdk/layout'
import { NgIf } from '@angular/common'
import { Component, inject, OnInit, ViewChild } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatMenuModule } from '@angular/material/menu'
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router'
import { OidcSecurityService } from 'angular-auth-oidc-client'

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
  sidenav!: MatSidenav
  isMobile = true
  isCollapsed = true

  private readonly observer = inject(BreakpointObserver)
  private readonly router = inject(Router)
  private readonly oidcSecurityService = inject(OidcSecurityService)
  protected authenticated = this.oidcSecurityService.authenticated
  protected oidcUser = this.oidcSecurityService.userData

  ngOnInit(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true
      } else {
        this.isMobile = false
      }
    })

    this.oidcSecurityService
      .checkAuth()
      .subscribe(({ isAuthenticated, accessToken }) => {
        console.log('app component: authenticated', isAuthenticated)
        console.log(`app component: current access token is '${accessToken}'`)

        // if (!isAuthenticated) {
        //   console.log('navigating to /login via app component')
        //   this.router.navigateByUrl('/login')
        // }
      })

    // if (!this.authenticated().isAuthenticated) {
    //   console.log('navigating to /login via app component')
    //   this.router.navigateByUrl('/login')
    // }
  }

  toggleMenu() {
    console.log('mobile?', this.isMobile)
    if (this.isMobile) {
      this.sidenav.toggle()
      this.isCollapsed = false // On mobile, the menu can never be collapsed
    } else {
      this.sidenav.open() // On desktop/tablet, the menu can never be fully closed
      this.isCollapsed = !this.isCollapsed
    }
  }

  logoutOidc() {
    console.log('start logoff (oidc logoff()')
    //this.oidcSecurityService.logoff().subscribe((result) => console.log(result))
    this.oidcSecurityService.logoffLocal()
    this.router.navigateByUrl('')
    location.reload()
  }
}
