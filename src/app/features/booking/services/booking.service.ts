import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BOOKING_URLS, DASHBOARD_URLS } from '../../../shared/constants/urls/url';
import { BookingPlan, BookingSelection, Space } from '../../../shared/constants/space.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private static readonly STORAGE_KEY = 'bookingSelection';
  private selection: BookingSelection = {};

  constructor(private http: HttpClient) {}

  checkAvailability(request: unknown): Observable<any> {
    return this.http.post(BOOKING_URLS.AVAILABILITY, request);
  }

  getAvailabilityGrid(spaceId: string, date: string): Observable<any> {
    return this.http.get(BOOKING_URLS.AVAILABILITY_GRID(spaceId, date));
  }

  getUnavailableDates(spaceId: string, year: number, month: number): Observable<any> {
    return this.http.get(BOOKING_URLS.UNAVAILABLE_DATES(spaceId, year, month));
  }

  calculatePrice(request: unknown): Observable<any> {
    return this.http.post(BOOKING_URLS.CALCULATE_PRICE, request);
  }

  createBooking(request: unknown): Observable<any> {
    return this.http.post(BOOKING_URLS.CREATE, request);
  }

  getAllSpaces(): Observable<Space[]> {
    return this.http.get<Space[]>(BOOKING_URLS.SPACES);
  }

  getSpaceById(id: string): Observable<Space> {
    return this.http.get<Space>(BOOKING_URLS.SPACE_BY_ID(id));
  }

  getSpaceBySlug(slug: string): Observable<Space> {
    return this.http.get<Space>(BOOKING_URLS.SPACE_BY_SLUG(slug));
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(DASHBOARD_URLS.STATS);
  }

  getMyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${BOOKING_URLS.BASE}/me`);
  }

  cancelBooking(bookingId: number): Observable<any> {
    return this.http.patch(`${BOOKING_URLS.BASE}/${bookingId}/cancel`, {});
  }

  setPlan(plan: string): void {
    this.setSelection({ plan: plan as BookingPlan });
  }

  setDates(start: Date, end: Date): void {
    this.setSelection({ date: start.getTime() === end.getTime() ? start : [start, end] });
  }

  setTimes(startTime: number, endTime: number): void {
    this.setSelection({ startTime, endTime });
  }

  setPrice(price: number): void {
    this.setSelection({ price });
  }

  getPrice(): number | undefined {
    return this.getSelection().price;
  }

  getBookingDetails(): BookingSelection {
    return this.getSelection();
  }

  getSelection(): BookingSelection {
    if (Object.keys(this.selection).length > 0) {
      return this.selection;
    }

    const stored = localStorage.getItem(BookingService.STORAGE_KEY);
    if (!stored) return {};

    try {
      const parsed = JSON.parse(stored) as BookingSelection;
      if (parsed.date) {
        parsed.date = Array.isArray(parsed.date)
          ? parsed.date.map((date) => new Date(String(date))) as [Date, Date]
          : new Date(String(parsed.date));
      }
      this.selection = parsed;
      return this.selection;
    } catch {
      localStorage.removeItem(BookingService.STORAGE_KEY);
      return {};
    }
  }

  setSelection(partial: Partial<BookingSelection>): void {
    this.selection = { ...this.getSelection(), ...partial };
    localStorage.setItem(BookingService.STORAGE_KEY, JSON.stringify(this.selection));
  }

  reset(): void {
    this.selection = {};
    localStorage.removeItem(BookingService.STORAGE_KEY);
  }

  setQuantity(quantity: number): void {
    this.setSelection({ reservedUnits: quantity });
  }
}
