import { Component, OnInit, OnDestroy } from "@angular/core";
import { style } from "@angular/animations";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy{

  isUserAuthenticated = false;
  private authSubscription: Subscription;
  constructor(private authService: AuthService) {
  }
  ngOnInit() {
    this.isUserAuthenticated = this.authService.getAuthStatus();
    this.authSubscription = this.authService.getAuthenticationStatus().subscribe(isAuthenticated => {
      this.isUserAuthenticated = isAuthenticated;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
