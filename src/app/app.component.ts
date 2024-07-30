import { NgIf } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { OidcSecurityService } from 'angular-auth-oidc-client'
import { HeadingComponent } from './core/heading/heading.component'
// router: Router

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeadingComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService)
  private readonly router = inject(Router)
  protected readonly authenticated = this.oidcSecurityService.authenticated

  title = 'Lorem List'

  ngOnInit(): void {
    this.oidcSecurityService
      .checkAuth()
      .subscribe(({ isAuthenticated, accessToken }) => {
        console.log('app authenticated', isAuthenticated)
        console.log(`Current access token is '${accessToken}'`)
      })

    if (!this.authenticated().isAuthenticated) {
      console.log('navigating to /login via app component')
      this.router.navigateByUrl('/login')
    }
  }
}
