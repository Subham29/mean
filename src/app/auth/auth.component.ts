import { Component, OnInit } from '@angular/core';
import { AppConstants } from '../app.constants';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoading: boolean = false;
  form: FormGroup;
  mode: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.mode = AppConstants.SIGNUP;
    this.form = new FormGroup({
      email: new FormControl(null, {validators: [Validators.email, Validators.required]}),
      password: new FormControl(null, {validators: [Validators.required]})
    });
  }

  handleLoginAndSignup() {
    if (this.mode === AppConstants.LOGIN) {
      this.authService.login(this.form.value.email, this.form.value.password).subscribe(response => {
        console.log(response);
        // if (response.hasOwnProperty("error")) {
        //   console.log("Sign Up Filed "+ response.error);
        // } else {
        //   console.log(response.message + "  Result: "+ JSON.stringify(response.result));
        // }
      });
    } else {
      this.authService.signUp(this.form.value.email, this.form.value.password).subscribe(response => {
        if (response.hasOwnProperty("error")) {
          console.log("Sign Up Filed "+ response.error);
        } else {
          console.log(response.message + "  Result: "+ JSON.stringify(response.result));
        }
      });
    }
  }

  onModeChanged() {
    if (this.mode === 'signup') {
      this.mode = 'login';
    } else {
      this.mode = 'signup';
    }
  }
}
