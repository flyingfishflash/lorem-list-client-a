import { DatePipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  AuthenticatedResult,
  OidcSecurityService,
  UserDataResult,
} from 'angular-auth-oidc-client';
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

  protected readonly userData: Signal<UserDataResult>;
  protected readonly authenticated: Signal<AuthenticatedResult>;
  readonly #appConfig = inject(AppConfigRuntime);
  readonly #oidcSecurityService = inject(OidcSecurityService);
  readonly #logger = new Logger('home.component');

  constructor() {
    this.authenticated = this.#oidcSecurityService.authenticated;
    this.userData = this.#oidcSecurityService.userData;

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
