import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { ApiError } from '../../../../shared/models/api.model';
import { ToastService } from '../../../../core/services/toast.service';
import { BackendWarmupService } from '../../../../core/services/backend-warmup.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['../auth.scss'],
  standalone: false,
})
export class Login {
  loginForm: FormGroup;
  submitted = false;
  isLoading = false;
  isServerReady$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private warmupService: BackendWarmupService
  ) {
    this.isServerReady$ = this.warmupService.isReady$;
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

    // Clear previous server errors
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control && control.errors?.['serverError']) {
        control.setErrors(null);
      }
    });
    this.loginForm.setErrors(null);

    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.success('Welcome back to TVS Spaces!', 'Login Successful');
      },
      error: (err: any) => {
        this.isLoading = false;
        let msg = err.error?.message;
        let isStarting = false;
        if (!msg || err.status === 0 || err.status === 502 || err.status === 503) {
          msg = 'The backend server is starting up (~1 minute on Render). Please wait a moment and try signing in again.';
          isStarting = true;
        }
        this.loginForm.setErrors({ apiError: msg });

        // Handle field validation errors
        const fields = err.error?.fields;
        if (fields) {
          Object.keys(fields).forEach(key => {
            const control = this.loginForm.get(key);
            if (control) {
              control.setErrors({ serverError: fields[key] });
            }
          });
        }

        this.toastService.error(msg, isStarting ? 'Server Starting' : 'Login Failed');
      },
    });
  }
}

