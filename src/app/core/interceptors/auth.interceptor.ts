import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {
        if (err.status === 401) {
          // try to refresh token
          return this.auth.refreshToken().pipe(
            switchMap(() => {
              // retry the original request with new token
              const cloned = req.clone({
                setHeaders: { Authorization: `Bearer ${this.auth.getToken()}` }
              });
              return next.handle(cloned);
            })
          );
        }
        return throwError(() => err);
      })
    );
  }
}
