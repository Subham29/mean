import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthService implements OnInit {

  private tokenTimer: any;
  private token: string;
  private authenticationStatus = new Subject<boolean>();
  isUserAuthenticated: boolean = false;

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.isUserAuthenticated;
  }

  getAuthenticationStatus() {
    return this.authenticationStatus.asObservable();
  }

  private storeAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  ngOnInit() {}

  constructor(private http: HttpClient, public router: Router) {}

  autoAuthUser() {
    const authData = this.getAuthData();
    if (!authData) {
      console.log("Token expired! Please Login again");
      return;
    }
    const now = new Date();
    const expiresIn = authData.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0) {
      this.isUserAuthenticated = true;
      this.authenticationStatus.next(true);
      this.token = authData.token;
      this.setAuthTimer(expiresIn / 1000);
    } else {
      this.logout();
    }
  }
  getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (token && expirationDate) {
      return {
        token: token,
        expirationDate: new Date(expirationDate)
      }
    }
    return;
  }

  signUp(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    return this.http.post<{error? : string, message?: string, result?: Object}>("http://localhost:3000/api/users/signup", authData)
      .subscribe(response => {
        if (response.hasOwnProperty("error")) {
          console.log("Sign Up Filed "+ response.error);
        } else {
          console.log(response.message + "  Result: "+ JSON.stringify(response.result));
          this.router.navigate(["/"]);
        }
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post<{message?: string, token?: string, expiresIn?: number}>("http://localhost:3000/api/users/login", authData)
      .subscribe(response => {
        if(response.token) {
          const now = new Date();
          const expirationDate = new Date(now.getTime() + (response.expiresIn * 1000));
          this.storeAuthData(response.token, expirationDate);
          this.setAuthTimer(response.expiresIn);
          this.token = response.token;
          this.isUserAuthenticated = true;
          this.authenticationStatus.next(true);
          this.router.navigate(["/"]);
        }
      });
  }
  setAuthTimer(expiresIn: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresIn * 1000);
  }

  logout() {
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.token = null;
    this.isUserAuthenticated = false;
    this.authenticationStatus.next(false);
    this.router.navigate(["/"]);
  }
}
