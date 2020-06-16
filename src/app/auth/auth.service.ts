import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";

@Injectable({providedIn: 'root'})
export class AuthService implements OnInit {
  ngOnInit() {

  }

  constructor(private http: HttpClient) {

  }

  signUp(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    return this.http.post<{error? : string, message?: string, result?: Object}>("http://localhost:3000/api/users/signup", authData);
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    return this.http.post<{error? : string, message?: string, result?: Object}>("http://localhost:3000/api/users/login", authData);
  }
}
