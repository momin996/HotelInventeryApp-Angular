import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if(!form.valid) return;
    const { email, password } = form.value;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if(this.isLoginMode) {
      console.log('Login User');
      authObs = this.authService.login(email, password);
    }
    else {
      console.log('Sign Up User');
      authObs = this.authService.signUp(email, password);
    }
    
    authObs.subscribe({
      next: response => {
        console.log(response);
        this.isLoading = false;
        this.router.navigate(['/recipes'])
      },
      error: errMsg => {
        this.error = errMsg;
        this.isLoading = false;
      }
    });

    form.reset();
  }

}
