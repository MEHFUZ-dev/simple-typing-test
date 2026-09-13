import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService } from '../../core/services/auth';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  registerForm;

  constructor(
  private fb: FormBuilder,
  private authService: AuthService,
  private router: Router
) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
  console.log('Register button clicked');

  if (this.registerForm.invalid) {
    console.log('Form is invalid');
    this.registerForm.markAllAsTouched();
    return;
  }

  const { username, email, password } = this.registerForm.getRawValue();

  this.authService.register(username!, email!, password!).subscribe({
    next: () => {
      console.log('REGISTRATION SUCCESS');

      // Automatically login after registration
      this.authService.login(username!, password!).subscribe({
        next: (token) => {
          console.log('AUTO LOGIN SUCCESS');

          this.authService.saveToken(token);

          this.router.navigate(['/typing-test']);
        },
        error: (error) => {
          console.error('AUTO LOGIN ERROR:', error);

          // Registration succeeded, but automatic login failed
          alert('Registration successful. Please login manually.');
          this.router.navigate(['/login']);
        }
      });
    },

    error: (error) => {
      console.error('REGISTER ERROR:', error);
      alert('Registration failed. Check the console.');
    }
  });
}
}