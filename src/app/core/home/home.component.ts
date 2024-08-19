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
import { ItemsService } from '../../domain/items/items.service';
import { ListsService } from '../../domain/lists/lists.service';
import { Logger } from '../logging/logger.service';
import { ManagementService } from '../management/management.service';

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
  // readonly #listService = inject(ListsService);
  readonly #managementService = inject(ManagementService);
  readonly #oidcSecurityService = inject(OidcSecurityService);
  readonly #logger = new Logger('home.component');
  readonly #itemsService = inject(ItemsService);

  constructor(private lsService: ListsService) {
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

    this.#managementService.getHealthStatusSimple().subscribe({
      next: (healthStatusSimple) => {
        if (healthStatusSimple) {
          this.#logger.debug('Api server health status is UP');
        } else {
          this.#logger.debug('Api server health status is not UP');
        }
      },
      error: (error) => {
        this.#logger.debug('health subscription' + error);
        // this.handleError(error)
      },
    });

    this.#managementService.getInfo().subscribe({
      next: (info) => {
        this.#logger.debug(info);
        // this.#logger.debug(info);
      },
      error: (error) => {
        this.#logger.debug('getLists subscription' + error);
      },
    });

    this.lsService.getLists().subscribe({
      next: (lists) => {
        this.#logger.debug(lists);
      },
      error: (error) => {
        this.#logger.debug('getLists subscription' + error);
      },
    });

    this.#itemsService.getItems().subscribe({
      next: (lists) => {
        this.#logger.debug(lists);
      },
      error: (error) => {
        this.#logger.debug('getItems subscription' + error);
      },
    });
  }
}
