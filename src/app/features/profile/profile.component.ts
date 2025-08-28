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
  user!: User;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.User;
    console.log(this.user);
    this.profileForm = this.fb.group({
      username: [this.user.username, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]],
      type: [this.user.type, [Validators.required]],
    });
  }

  enableEdit() {
    this.editMode = true;
    this.profileForm.patchValue({
      username: this.user.username,
      email: this.user.email,
      type: this.user.type,
    });
  }

  saveProfile() {
    if (this.profileForm.valid) {
      const updatedUser: UserUpdateRequest = {
        ...this.user,
        ...this.profileForm.value,
        password: this.profileForm.value.password
          ? this.profileForm.value.password
          : null,
      };
      this.user = {
         ...this.user,
        ...this.profileForm.value,
        password: this.profileForm.value.password
          ? this.profileForm.value.password
          : null,
      }
      this.userService.updateUser(updatedUser).subscribe(
        {
          next:(res)=>{
            alert(res.message);
            this.authService.setUserLocalStorage(this.user);
            window.location.reload();
          },
          error:(err : ApiError)=>{
            alert(err.error.message)
          }
        }
      )
      this.editMode = false;
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.profileForm.reset({
      username: this.user.username,
      email: this.user.email,
      password: '',
      type: this.user.type,
    });
  }
}
