import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AUTH_URLS } from '../../shared/models/urls/url';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router, private http: HttpClient) {}
  login(email: string, password: string): Observable<any> {
    return this.http.post(AUTH_URLS.LOGIN, { email, password });
  }

  signup(username: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_URLS.REGISTER, { username, email, password });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
