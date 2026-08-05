import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { ApiError, UserUpdateRequest } from '../../../../shared/models/api.model';
import { ToastService } from '../../../../core/services/toast.service';
import { BackendWarmupService } from '../../../../core/services/backend-warmup.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrls: ['../auth.scss'],
})
export class Register {
  registerForm: FormGroup;
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
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        userType: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Register.passwordStrengthValidator,
          ],
        ],
        confirmPassword: [
          '',
          [Validators.required, this.passwordMatchValidator],
        ],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  static passwordStrengthValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value || '';

    const errors: ValidationErrors = {};

    if (value.length < 8) {
      errors['minlength'] = true;
    }
    if (!/[A-Z]/.test(value)) {
      errors['uppercase'] = true;
    }
    if (!/[0-9]/.test(value)) {
      errors['number'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  }
  get f() {
    return this.registerForm.controls;
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({
        ...group.get('confirmPassword')?.errors,
        mismatch: true,
      });
      return { mismatch: true };
    } else {
      if (group.get('confirmPassword')?.hasError('mismatch')) {
        const errors = { ...group.get('confirmPassword')?.errors };
        delete errors['mismatch'];
        if (Object.keys(errors).length === 0) {
          group.get('confirmPassword')?.setErrors(null);
        } else {
          group.get('confirmPassword')?.setErrors(errors);
        }
      }
      return null;
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.isLoading = true;
    const { name, email, password, userType } = this.registerForm.value;
    const user: UserUpdateRequest = {
      username: name,
      email: email,
      password: password,
      type: userType,
    };
    this.authService.signup(user).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.success('Welcome to TVS Spaces!', 'Account Created');
      },
      error: (err: any) => {
        this.isLoading = false;
        let msg = err.error?.message;
        if (!msg || err.status === 0 || err.status === 502 || err.status === 503) {
          msg = 'The backend server is starting up (~1 minute on Render). Please wait a moment and try signing up again.';
        }
        this.registerForm.setErrors({ apiError: msg });
        this.toastService.error(msg, 'Server Starting');
      },
    });
  }
}

