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
    console.log(this.registerForm.value);
    this.registerForm.markAllAsTouched();
    return;
  }

  const { username, email, password } =
    this.registerForm.getRawValue();

  console.log('Sending:', username, email, password);

  this.authService
    .register(username!, email!, password!)
    .subscribe({
      next: (response) => {
  console.log('REGISTRATION SUCCESS:', response);

  this.router.navigate(['/typing-test']);
},
      error: (error) => {
        console.error('REGISTER ERROR:', error);
        alert('Registration failed. Check the console.');
      }
    });
}
}