import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { OidcSecurityService } from 'angular-auth-oidc-client'

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  private readonly oidcSecurityService = inject(OidcSecurityService)
  protected readonly authenticated = this.oidcSecurityService.authenticated

  login(): void {
    this.oidcSecurityService.authorize()
  }

  refreshSession(): void {
    this.oidcSecurityService.authorize()
  }

  logout(): void {
    this.oidcSecurityService.logoff().subscribe((result) => {
      console.log(result)
    })
  }
}
