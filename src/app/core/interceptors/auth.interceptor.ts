import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  finalize,
  shareReplay,
  switchMap,
  throwError,
} from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshRequest$: Observable<{ token: string }> | null = null;

  constructor(private readonly auth: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.includes('/auth/')) {
      return next.handle(request);
    }

    const token = this.auth.getToken();
    const authenticatedRequest = token
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request;

    return next.handle(authenticatedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401) {
          return throwError(() => error);
        }

        return this.refreshAccessToken().pipe(
          switchMap(({ token: refreshedToken }) =>
            next.handle(
              request.clone({
                setHeaders: { Authorization: `Bearer ${refreshedToken}` },
              })
            )
          ),
          catchError((refreshError) => {
            this.auth.logout();
            return throwError(() => refreshError);
          })
        );
      })
    );
  }

  private refreshAccessToken(): Observable<{ token: string }> {
    if (!this.refreshRequest$) {
      this.refreshRequest$ = this.auth.refreshToken().pipe(
        shareReplay(1),
        finalize(() => {
          this.refreshRequest$ = null;
        })
      );
    }
    return this.refreshRequest$;
  }
}
