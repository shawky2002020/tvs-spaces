import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AUTH_URLS } from '../../shared/constants/urls/url';
import { User, UserResponse } from '../../shared/models/user.model';
import { UserUpdateRequest } from '../../shared/models/api.model';

const USER_KEY = 'user';
const BOOKING_SELECTION_KEY = 'bookingSelection';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;
  private userSubject = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());

  readonly User$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  get User(): User {
    return this.userSubject.value ?? ({} as User);
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
          this.updateCachedUser(res.user);
          this.accessToken = res.token;
          this.router.navigate(['/dashboard']);
        })
      );
  }

  signup(user: UserUpdateRequest): Observable<UserResponse> {
    return this.http
      .post<UserResponse>(
        AUTH_URLS.REGISTER,
        user,
        { withCredentials: true }
      )
      .pipe(
        tap((res) => {
          this.updateCachedUser(res.user);
          this.accessToken = res.token;
          this.router.navigate(['/dashboard']);
        })
      );
  }

  getToken(): string | null {
    return this.accessToken;
  }

  private isLoggingOut = false;

  logout(): void {
    if (this.isLoggingOut) return;
    this.isLoggingOut = true;
    this.http.post(AUTH_URLS.LOGOUT, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.isLoggingOut = false;
        this.clearLocalSession();
      },
      error: () => {
        this.isLoggingOut = false;
        this.clearLocalSession();
      }
    });
  }

  private clearLocalSession(): void {
    this.accessToken = null;
    this.userSubject.next(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(BOOKING_SELECTION_KEY);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  refreshToken(): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(AUTH_URLS.REFRESH, {}, { withCredentials: true })
      .pipe(
        tap((res) => {
          this.accessToken = res.token;
        })
      );
  }

  updateCachedUser(user: User): void {
    this.userSubject.next(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  setUserLocalStorage(user: User): void {
    this.updateCachedUser(user);
  }

  private getUserFromLocalStorage(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as User;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }
}
