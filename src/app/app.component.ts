import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { NavigationComponent } from './core/navigation/navigation.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  implements OnInit {

title = "Lorem List"

  private readonly oidcSecurityService = inject(OidcSecurityService);

  ngOnInit(): void {
    console.log("app component ngoninit")
    this.oidcSecurityService
      .checkAuth()
      .subscribe(({ isAuthenticated, accessToken }) => {
        console.log('app authenticated', isAuthenticated);
        console.log(`Current access token is '${accessToken}'`);
      });
  }

  login(): void {
    console.log('start login');
    this.oidcSecurityService.authorize();
  }

  refreshSession(): void {
    console.log('start refreshSession');
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    console.log('start logoff');
    this.oidcSecurityService
      .logoff()
      .subscribe((result) => console.log(result));
  }

}
