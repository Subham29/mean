import { Component, OnInit } from '@angular/core';
import { AppConstants } from '../app.constants';
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoading: boolean = false;
  form: FormGroup;
  mode: string;

  constructor() { }

  ngOnInit() {
    this.mode = AppConstants.LOGIN;
    this.form = new FormGroup({
      email: new FormControl(null, {validators: [Validators.email, Validators.required]}),
      password: new FormControl(null, {validators: [Validators.required]})
    });
  }

  handleLoginAndSignup() {
    if (this.mode === AppConstants.LOGIN) {
      console.log(this.mode);

    } else {
      console.log(this.mode);

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
