import { AsyncPipe, NgIf } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatToolbarModule } from '@angular/material/toolbar'
import { Router, RouterLink } from '@angular/router'
import { OidcSecurityService } from 'angular-auth-oidc-client'

@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    NgIf,
    RouterLink,
    AsyncPipe,
  ],
})
export class HeadingComponent implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService)
  private readonly router = inject(Router)
  oidcUser = this.oidcSecurityService.userData

  ngOnInit(): void {}

  // get isAdmin() {
  //   return (
  //     this.basicAuthUser &&
  //     this.basicAuthUser.roles.includes(BasicAuthUserRole.administrator)
  //   )
  // }

  // navigateToProfile() {
  //   // if already at the profile route, force a reload of window, which will refresh the
  //   // component using the currently logged in user's data
  //   if (this.router.url === '/profile') {
  //     location.reload()
  //   } else {
  //     this.router.navigateByUrl('/profile', {
  //       state: { data: { userId: this.basicAuthUser.id } },
  //     })
  //   }
  // }

  logoutOidc() {
    console.log('start logoff (oidc logoff()')
    //this.oidcSecurityService.logoff().subscribe((result) => console.log(result))
    this.oidcSecurityService.logoffLocal()
    this.router.navigateByUrl('')
    location.reload()
  }

  // logoutBasicAuth() {
  //   this.basicAuthService.signOut('parameter')
  // }
}
