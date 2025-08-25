import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AUTH_URLS } from '../../shared/models/urls/url';
import { User, UserResponse } from '../../shared/models/user.model';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;
  private UserSubject: BehaviorSubject<User> = new BehaviorSubject<User>({} as User);
  User$ : Observable<User> = this.UserSubject.asObservable();
  constructor(private http: HttpClient, private router: Router) {}
  get User(){
    return this.UserSubject.value;
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
          console.log(res.user.authorities);
          
          this.UserSubject.next(res.user);
          this.accessToken = res.token; // store in memory
          this.router.navigate(['/dashboard']);
        },
      )
      );
  }
  signup(username: string, email: string, password: string): Observable<UserResponse> {
    return this.http
      .post<UserResponse>(
        AUTH_URLS.REGISTER,
        { username, email, password },
        { withCredentials: true }
      )
      .pipe(
        tap((res) => {
          console.log(res);

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
          this.accessToken = res.accessToken;
        })
      );
  }
}
