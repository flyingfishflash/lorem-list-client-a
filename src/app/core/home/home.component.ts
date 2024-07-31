import { JsonPipe } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { OidcSecurityService } from 'angular-auth-oidc-client'
import { BuildProperties } from '../../app-build-properties'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JsonPipe, MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  buildProperties: BuildProperties = {
    artifact: 'default',
    ciPipelineId: '',
    ciPlatform: 'default',
    commit: 'default',
    group: 'default',
    name: 'default',
    time: 'default',
    version: 'default',
  }

  private readonly oidcSecurityService = inject(OidcSecurityService)
  protected readonly userData = this.oidcSecurityService.userData
  protected readonly authenticated = this.oidcSecurityService.authenticated

  ngOnInit(): void {
    console.log('home component: init')
  }
}
