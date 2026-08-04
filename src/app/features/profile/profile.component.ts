import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../core/services/user.service';
import { ApiError, UserUpdateRequest } from '../../shared/models/api.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  editMode = false;
  saving = false;
  user!: User;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.User;
    this.profileForm = this.fb.group({
      username: [this.user.username, [Validators.required, Validators.minLength(3)]],
      email: [this.user.email, [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]],
      currentPassword: [''],
      type: [this.user.type, [Validators.required]],
    });
  }

  enableEdit(): void {
    this.editMode = true;
    this.profileForm.reset({
      username: this.user.username,
      email: this.user.email,
      password: '',
      currentPassword: '',
      type: this.user.type,
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid || this.saving) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formValue = this.profileForm.getRawValue();
    if (formValue.password && !formValue.currentPassword) {
      alert('Enter your current password before choosing a new password.');
      return;
    }

    const updatedUser: UserUpdateRequest = {
      username: formValue.username,
      email: formValue.email,
      type: formValue.type,
    };

    if (formValue.password) {
      updatedUser.password = formValue.password;
      updatedUser.currentPassword = formValue.currentPassword;
    }

    this.saving = true;
    this.userService.updateUser(updatedUser).subscribe({
      next: (res) => {
        this.user = res.user;
        this.authService.updateCachedUser(res.user);
        this.profileForm.patchValue({
          username: res.user.username,
          email: res.user.email,
          password: '',
          currentPassword: '',
          type: res.user.type,
        });
        this.editMode = false;
        this.saving = false;
        alert(res.message);
      },
      error: (err: ApiError) => {
        this.saving = false;
        alert(err.error?.message || 'Unable to update profile.');
      },
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.profileForm.reset({
      username: this.user.username,
      email: this.user.email,
      password: '',
      currentPassword: '',
      type: this.user.type,
    });
  }
}
