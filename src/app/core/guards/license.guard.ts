import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LicenseGuard implements CanActivate {
  private apiUrl = 'https://spaces-liscence.netlify.app/.netlify/functions/license';

  constructor(private http: HttpClient, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.http.get<{ status: string }>(this.apiUrl).pipe(
      tap(res => console.log("License Status:", res.status)),
      map(res => {
        // allow only if license is valid
        if (res.status === 'valid') {
          return true;
        }
        // if expired or expiring soon -> redirect
        return this.router.createUrlTree(['/payment-required']);
      }),
      catchError(err => {
        console.error("License check failed:", err);
        // fallback: redirect to payment page if error
        return of(this.router.createUrlTree(['/payment-required']));
      })
    );
  }
}
