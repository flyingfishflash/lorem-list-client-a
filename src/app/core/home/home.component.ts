import { DatePipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BuildProperties } from '../../app-build-properties';
import { AppConfigRuntime } from '../../app-config-runtime';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DatePipe, JsonPipe, MatCardModule],
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
  };

  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly appConfig = inject(AppConfigRuntime);
  protected readonly userData = this.oidcSecurityService.userData;
  protected readonly authenticated = this.oidcSecurityService.authenticated;

  constructor() {
    if (this.appConfig.buildProperties) {
      this.buildProperties = { ...this.appConfig.buildProperties };
    } else {
      console.log('Build properties are not populated');
    }
  }

  ngOnInit(): void {
    console.log('home component: init');
  }
}
