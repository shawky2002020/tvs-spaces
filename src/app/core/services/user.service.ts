import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { USER_URLS } from '../../shared/constants/urls/url';
import { ApiResponse, UserUpdateRequest } from '../../shared/models/api.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}
  updateUser(user: UserUpdateRequest): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(USER_URLS.EDIT, user);
  }
}
