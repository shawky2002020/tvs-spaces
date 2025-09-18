import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip token for auth endpoints
    if (req.url.includes('/auth/')) {
      return next.handle(req);
    }

    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${this.auth.getToken()}` }
    });

    return next.handle(authReq).pipe(
      catchError(err => {
        if (err.status === 401) {
          // Try refreshing token
          return this.auth.refreshToken().pipe(
            switchMap(newToken => {
              // Retry with new token
              console.log('This new token is',newToken.token);
              
              const cloned = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken.token}` }
              });
              return next.handle(cloned);
            }),
            catchError(refreshErr => {
              // If refresh also fails, redirect to login
              this.auth.logout();
              this.router.navigate(['/auth/login']);
              return throwError(() => refreshErr);
            })
          );
        }
        return throwError(() => err);
      })
    );
  }
}
