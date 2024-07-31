import { NgIf } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { OidcSecurityService } from 'angular-auth-oidc-client'
import { HeadingComponent } from './core/heading/heading.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeadingComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router)
  private readonly oidcSecurityService = inject(OidcSecurityService)
  protected authenticated = this.oidcSecurityService.authenticated

  ngOnInit(): void {
    this.oidcSecurityService
      .checkAuth()
      .subscribe(({ isAuthenticated, accessToken }) => {
        console.log('app component: authenticated', isAuthenticated)
        console.log(`app component: current access token is '${accessToken}'`)

        if (!isAuthenticated) {
          console.log('navigating to /login via app component')
          this.router.navigateByUrl('/login')
        }
      })

    // if (!this.authenticated().isAuthenticated) {
    //   console.log('navigating to /login via app component')
    //   this.router.navigateByUrl('/login')
    // }
  }
}
