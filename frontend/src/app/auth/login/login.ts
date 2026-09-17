import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } =
      this.loginForm.getRawValue();

    this.authService
      .login(username!, password!)
      .subscribe({
        next: (token) => {


          this.authService.saveToken(token);

          this.router.navigate(['/typing-test']);
        },

        error: (error) => {



          alert('Invalid username or password');
        }
      });
  }

  loginWithGoogle(): void {
  window.location.href = 'https://simple-typing-test.onrender.com/oauth2/authorization/google';
}
}