import { JsonPipe } from '@angular/common'
import { Component, inject } from '@angular/core'
import { OidcSecurityService } from 'angular-auth-oidc-client'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly oidcSecurityService = inject(OidcSecurityService)
  protected readonly userData = this.oidcSecurityService.userData
  protected readonly authenticated = this.oidcSecurityService.authenticated
}
