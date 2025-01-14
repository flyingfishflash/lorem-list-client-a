import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  AuthenticatedResult,
  OidcSecurityService,
  UserDataResult,
} from 'angular-auth-oidc-client';
import { environment } from '../../../../environments/environment';
import { BuildProperties } from '../../../app-build-properties';
import { AppConfigRuntime } from '../../../app-config-runtime';
// import { ItemsService } from '../../domain/items/items.service';
// import { ListsService } from '../../domain/lists/lists.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { Logger } from '../../../core/shared/logging/logger';
import { ManagementService } from '../../services/api/management.service';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, DatePipe, JsonPipe, MatButtonModule, MatCardModule],
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

  oidcName = '';
  protected readonly authenticated: Signal<AuthenticatedResult>;
  protected readonly userData: Signal<UserDataResult>;
  readonly #appConfig = inject(AppConfigRuntime);
  readonly #breakpointObserver = inject(BreakpointObserver);
  // readonly #itemsService = inject(ItemsService);
  // readonly #listService = inject(ListsService);
  readonly #logger = new Logger('home.component');
  readonly #managementService = inject(ManagementService);
  readonly #oidcSecurityService = inject(OidcSecurityService);
  readonly #router = inject(Router);

  constructor() {
    this.authenticated = this.#oidcSecurityService.authenticated;
    this.userData = this.#oidcSecurityService.userData;

    // populate version and build information
    if (this.#appConfig.buildProperties) {
      this.buildProperties = { ...this.#appConfig.buildProperties };
    } else {
      this.#logger.error('Build properties are not populated');
    }

    // populate oidc name
    if (environment.oidc.name !== '') {
      this.oidcName = environment.oidc.name;
    } else {
      this.#logger.error('OIDC Name not available in environment');
    }
  }

  ngOnInit(): void {
    this.#logger.debug('ngOnInit');

    this.#managementService.getHealthStatusSimple().subscribe({
      // next: (healthStatusSimple) => {
      //   // if (healthStatusSimple) {
      //   //   this.#logger.debug('Api server health status is UP');
      //   // } else {
      //   //   this.#logger.debug('Api server health status is not UP');
      //   // }
      // },
      error: (error) => {
        this.#logger.debug('health subscription', error);
        // this.handleError(error)
      },
    });

    this.#managementService.getInfo().subscribe({
      // next: (info) => {
      //   this.#logger.debug(JSON.stringify(info))
      // },
      error: (error) => {
        this.#logger.debug('getInfo subscription', error);
      },
    });

    // this.#listService.getLists().subscribe({
    //   // next: (lists) => {
    //   //   this.#logger.debug(lists);
    //   // },
    //   error: (error) => {
    //     this.#logger.debug('getLists subscription' + error);
    //   },
    // });

    // this.#listService.getPublicLists().subscribe({
    //   next: (lists) => {
    //     this.#logger.debug('public lists: ', lists);
    //   },
    //   error: (error) => {
    //     this.#logger.debug('getPublicLists subscription' + error);
    //   },
    // });

    // this.#itemsService.getItems().subscribe({
    //   // next: (lists) => {
    //   //   this.#logger.debug(lists);
    //   // },
    //   error: (error) => {
    //     this.#logger.debug('getItems subscription' + error);
    //   },
    // });
  }

  noOp() {}

  // eslint-disable-next-line @typescript-eslint/member-ordering
  isHandset: Observable<boolean> = this.#breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  login() {
    console.debug('login()');
    console.debug('start login (oidc authorize()');
    this.#oidcSecurityService.authorize();
  }

  logoutOidc() {
    this.#logger.debug('start logoff (oidc logoff()');
    //this.oidcSecurityService.logoff().subscribe((result) => this.#logger.debug(result))
    this.#oidcSecurityService.logoffLocal();
    this.#router.navigateByUrl('');
    location.reload();
  }
}
