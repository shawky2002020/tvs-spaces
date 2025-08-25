import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AUTH_URLS } from '../../shared/constants/urls/url';
import { User, UserResponse } from '../../shared/models/user.model';
import { UserUpdateRequest } from '../../shared/models/api.model';
const USERKEY = 'user';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;
  private UserSubject = new BehaviorSubject<User | null>(null);

  User$ = this.UserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  get User(): User  {
    const user = this.UserSubject.value ?? this.getUserFromLocalStorage();
    if (user && !this.UserSubject.value) {
      this.UserSubject.next(user);
    }
    return user;
  }

  login(email: string, password: string): Observable<UserResponse> {
    return this.http
      .post<UserResponse>(
        AUTH_URLS.LOGIN,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        tap((res) => {
          this.setUserLocalStorage(res.user);

          this.UserSubject.next(res.user);

          this.accessToken = res.token; // store in memory
          this.router.navigate(['/dashboard']);
        })
      );
  }
  signup(
    user:UserUpdateRequest
  ): Observable<UserResponse> {
    return this.http
      .post<UserResponse>(
        AUTH_URLS.REGISTER,
        user,
        { withCredentials: true }
      )
      .pipe(
        tap((res) => {
          console.log(res);
          this.setUserLocalStorage(res.user);
          this.UserSubject.next(res.user);
          this.accessToken = res.token; // store in memory
          this.router.navigate(['/dashboard']);
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
    return this.http
      .post<any>(AUTH_URLS.REFRESH, {}, { withCredentials: true })
      .pipe(
        tap((res) => {
          this.accessToken = res.token;
        })
      );
  }

  setUserLocalStorage(user: User) {
    const UserStr = JSON.stringify(user);
    localStorage.setItem(USERKEY, UserStr);
  }
  getUserFromLocalStorage(): User {
    const userStr = localStorage.getItem(USERKEY);
    const user = userStr ? JSON.parse(userStr) : null;

    return user || ({} as User);
  }
}
