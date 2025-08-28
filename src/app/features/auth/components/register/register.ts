import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth/auth.service';
import { ApiError, UserUpdateRequest } from '../../../../shared/models/api.model';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrls: ['../auth.scss'],
})
export class Register {
  registerForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
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

    // Return errors if any, otherwise null
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
    const { name, email, password , userType } = this.registerForm.value;
    const user : UserUpdateRequest =  {
      username : name,
      email:email,
      password:password,
      type:userType
    }
    this.authService.signup(user).subscribe({
      next: () => {
        alert('registered successfully');
      },
      error:(err:ApiError)=> {
        
        alert(err.error.message);
      },
    });
  }
}
