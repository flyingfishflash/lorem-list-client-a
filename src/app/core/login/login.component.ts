import { DatePipe, NgIf } from '@angular/common'
import { Component, OnInit } from '@angular/core'
// import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
// import { MatFormFieldModule } from '@angular/material/form-field'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
// import { MatInputModule } from '@angular/material/input'
import { MatTabsModule } from '@angular/material/tabs'
import { OidcSecurityService } from 'angular-auth-oidc-client'
import { environment } from '../../../environments/environment'
import { BuildProperties } from '../../app-build-properties'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatTabsModule,
    NgIf,
    // FormsModule,
    // MatFormFieldModule,
    // MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    DatePipe,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
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

  errorMessage = ''

  oidcName = ''
  userData: any

  constructor(private oidcSecurityService: OidcSecurityService) {
    if (environment.oidc.name !== '') this.oidcName = environment.oidc.name
    else {
      console.error('OIDC Name not available in environment')
    }
  }

  ngOnInit(): void {
    // console.debug('login()')
    // console.debug('start login (oidc authorize()')
    // this.oidcSecurityService.authorize()
    // this.oidcSecurityService.getUserData().subscribe((x) => {
    //   this.userData = x
    // })
    // console.log('userData: ' + this.userData)
  }

  login() {
    console.debug('login()')
    console.debug('start login (oidc authorize()')
    this.oidcSecurityService.authorize()
  }
}
