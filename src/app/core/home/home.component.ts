import { DatePipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BuildProperties } from '../../app-build-properties';
import { AppConfigRuntime } from '../../app-config-runtime';
import { Logger } from '../logging/logger.service';

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

  readonly #appConfig = inject(AppConfigRuntime);
  readonly #oidcSecurityService = inject(OidcSecurityService);
  readonly #logger = new Logger('home.component');
  protected readonly userData = this.#oidcSecurityService.userData;
  protected readonly authenticated = this.#oidcSecurityService.authenticated;

  constructor() {
    if (this.#appConfig.buildProperties) {
      this.buildProperties = { ...this.#appConfig.buildProperties };
    } else {
      this.#logger.error('Build properties are not populated');
    }
  }

  ngOnInit(): void {
    this.#logger.debug('ngOnInit');
  }
}
