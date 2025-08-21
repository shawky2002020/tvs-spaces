import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AUTH_URLS } from '../../shared/models/urls/url';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(
        AUTH_URLS.LOGIN,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        tap((res) => {
          this.accessToken = res.accessToken; // store in memory
        })
      );
  }
  signup(username: string, email: string, password: string): Observable<any> {
    return this.http
      .post<any>(
        AUTH_URLS.REGISTER,
        { username,email, password },
        { withCredentials: true }
      )
      .pipe(
        tap((res) => {
          this.accessToken = res.accessToken; // store in memory
        })
      );
  }

  getToken(): string | null {
    return this.accessToken;
  }

  logout(): void {
    this.accessToken = null;
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  refreshToken(): Observable<any> {
  return this.http.post<any>('/api/auth/refresh', {}, { withCredentials: true })
    .pipe(tap(res => {
      this.accessToken = res.accessToken;
    }));
}
}
