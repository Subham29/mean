import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConstants } from '../app.constants';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  form: FormGroup;
  mode: string;
  authStatusSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnDestroy(): void {

  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthenticationStatus().subscribe((response) => {
      this.isLoading = false;
    });
    this.mode = AppConstants.SIGNUP;
    this.form = new FormGroup({
      email: new FormControl(null, {validators: [Validators.email, Validators.required]}),
      password: new FormControl(null, {validators: [Validators.required]})
    });
  }

  handleLoginAndSignup() {
    this.isLoading = true;
    if (this.mode === AppConstants.LOGIN) {
      this.authService.login(this.form.value.email, this.form.value.password);
    } else {
      this.authService.signUp(this.form.value.email, this.form.value.password);
    }
    this.form.reset();
  }

  onModeChanged() {
    if (this.mode === 'signup') {
      this.mode = 'login';
    } else {
      this.mode = 'signup';
    }
  }
}
