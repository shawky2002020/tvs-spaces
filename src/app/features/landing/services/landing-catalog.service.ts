import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { BookingService } from '../../booking/services/booking.service';
import { LandingCatalogState, LandingSpace, toLandingSpace } from '../models/landing.model';

const EMPTY_STATE: Omit<LandingCatalogState, 'status' | 'message'> = {
  spaces: [],
  desks: [],
  rooms: [],
};

/**
 * Single owner of the landing page's data.
 *
 * Every section reads from `state$`, which is one shared `GET /bookings/spaces`
 * request - the section components stay presentational and no section triggers
 * its own fetch. `reload()` re-runs the request so an API failure is recoverable
 * without a page refresh.
 */
@Injectable({ providedIn: 'root' })
export class LandingCatalogService {
  private readonly bookingService = inject(BookingService);
  private readonly reload$ = new BehaviorSubject<void>(undefined);

  readonly state$: Observable<LandingCatalogState> = this.reload$.pipe(
    switchMap(() =>
      this.bookingService.getAllSpaces().pipe(
        map((spaces) => this.toReadyState(spaces.map(toLandingSpace))),
        startWith<LandingCatalogState>({
          ...EMPTY_STATE,
          status: 'loading',
          message: '',
        }),
        catchError((error) =>
          of<LandingCatalogState>({
            ...EMPTY_STATE,
            status: 'error',
            message:
              error?.error?.message ||
              'We could not load the workspaces just now.',
          })
        )
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  reload(): void {
    this.reload$.next();
  }

  private toReadyState(spaces: LandingSpace[]): LandingCatalogState {
    return {
      status: 'ready',
      message: '',
      spaces,
      desks: spaces.filter((space) => space.kind === 'desk'),
      rooms: spaces.filter((space) => space.kind === 'room'),
    };
  }
}
