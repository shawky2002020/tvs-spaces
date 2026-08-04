import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth/auth.service';
import { ApiError } from '../../../../shared/models/api.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['../auth.scss'],
  standalone: false,
})
export class Login {
  loginForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: () => {
        // Navigation to /dashboard is handled automatically by AuthService.tap()
      },
      error: (err: ApiError) => {
        this.loginForm.setErrors({ apiError: err.error?.message || 'Login failed' });
      },
    });
  }
}
