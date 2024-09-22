import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { environment } from '../../../environments/environment';
import { BuildProperties } from '../../app-build-properties';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    DatePipe,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  buildProperties: BuildProperties = {
    artifact: 'default',
    ciPipelineId: '',
    ciPlatform: 'default',
    commit: 'default',
    group: 'default',
    name: 'default',
    time: 'default',
    version: 'default',
  };

  errorMessage = '';
  oidcName = '';
  private oidcSecurityService = inject(OidcSecurityService);

  constructor() {
    if (environment.oidc.name !== '') this.oidcName = environment.oidc.name;
    else {
      console.error('OIDC Name not available in environment');
    }
  }

  login() {
    console.debug('login()');
    console.debug('start login (oidc authorize()');
    this.oidcSecurityService.authorize();
  }
}
