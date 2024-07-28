import { Component, OnInit } from '@angular/core'
import { OidcSecurityService } from 'angular-auth-oidc-client'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  oidcName = ''
  userData: any

  constructor(private oidcSecurityService: OidcSecurityService) {
    if (environment.oidc.name !== '') this.oidcName = environment.oidc.name
    else {
      console.error('OIDC Name not available in environment')
    }
  }

  ngOnInit(): void {
    console.debug('login()')
    console.debug('start login (oidc authorize()')
    this.oidcSecurityService.authorize()
    this.oidcSecurityService.getUserData().subscribe((x) => {
      this.userData = x
    })
    console.log('userData: ' + this.userData)
  }

  // login() {
  //   console.debug('login()')
  //   console.debug('start login (oidc authorize()')
  //   this.oidcSecurityService.authorize()
  // }
}
