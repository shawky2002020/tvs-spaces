import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { USER_URLS } from '../../shared/constants/urls/url';
import { UserUpdateRequest, UserUpdateResponse } from '../../shared/models/api.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  updateUser(user: UserUpdateRequest): Observable<UserUpdateResponse> {
    return this.http.patch<UserUpdateResponse>(USER_URLS.EDIT, user);
  }
}
