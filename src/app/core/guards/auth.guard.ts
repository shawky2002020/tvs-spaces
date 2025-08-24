import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    if (this.authService.isAuthenticated()) {
      return of(true);
    }

    return this.authService.refreshToken().pipe(
      map(() => true), // refresh succeeded → allow
      catchError(() => {
        console.log('Guard redirected to login');
        this.router.navigate(['/auth/login']);
        return of(false);
      })
    );
  }
}
