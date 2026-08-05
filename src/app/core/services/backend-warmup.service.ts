import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, interval, of, switchMap, takeWhile, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BackendWarmupService {
  private isReadySubject = new BehaviorSubject<boolean>(false);
  private isWarmingSubject = new BehaviorSubject<boolean>(false);
  private retryCountSubject = new BehaviorSubject<number>(0);
  private elapsedSecondsSubject = new BehaviorSubject<number>(0);
  private statusMessageSubject = new BehaviorSubject<string>('Connecting to backend...');

  readonly isReady$ = this.isReadySubject.asObservable();
  readonly isWarming$ = this.isWarmingSubject.asObservable();
  readonly retryCount$ = this.retryCountSubject.asObservable();
  readonly elapsedSeconds$ = this.elapsedSecondsSubject.asObservable();
  readonly statusMessage$ = this.statusMessageSubject.asObservable();

  private timerInterval: any = null;
  private isChecking = false;

  constructor(private http: HttpClient) {
    this.startHealthCheck();
  }

  get isReady(): boolean {
    return this.isReadySubject.value;
  }

  startHealthCheck(): void {
    if (this.isChecking || this.isReadySubject.value) return;
    this.isChecking = true;

    const startTime = Date.now();
    this.timerInterval = setInterval(() => {
      if (!this.isReadySubject.value) {
        this.elapsedSecondsSubject.next(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);

    // Show warming overlay if response takes more than 800ms
    const warmingTimeout = setTimeout(() => {
      if (!this.isReadySubject.value) {
        this.isWarmingSubject.next(true);
        this.statusMessageSubject.next('Waking up backend service on Render... (this may take ~1 min on cold start)');
      }
    }, 800);

    this.pollHealthEndpoint(warmingTimeout);
  }

  private pollHealthEndpoint(warmingTimeout: any): void {
    const healthUrl = this.getHealthUrl();
    
    // Poll every 3 seconds until successful
    interval(3000)
      .pipe(
        switchMap(() => {
          this.retryCountSubject.next(this.retryCountSubject.value + 1);
          return this.pingHealth(healthUrl);
        }),
        takeWhile((res) => !res, true)
      )
      .subscribe({
        next: (success) => {
          if (success) {
            clearTimeout(warmingTimeout);
            this.handleSuccess();
          }
        }
      });

    // Also fire immediate first ping
    this.pingHealth(healthUrl).subscribe((success) => {
      if (success) {
        clearTimeout(warmingTimeout);
        this.handleSuccess();
      }
    });
  }

  private pingHealth(url: string): Observable<boolean> {
    return this.http.get<{ status: string }>(url, { headers: { 'Cache-Control': 'no-cache' } }).pipe(
      tap((res) => {
        if (res && res.status === 'UP') {
          // Success
        }
      }),
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  private handleSuccess(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.isReadySubject.next(true);
    this.isWarmingSubject.next(false);
    this.statusMessageSubject.next('Backend ready!');
    this.isChecking = false;
  }

  private getHealthUrl(): string {
    const apiBase = environment.apiUrl ? environment.apiUrl.replace(/\/+$/, '') : '';
    return `${apiBase}/health`;
  }
}
