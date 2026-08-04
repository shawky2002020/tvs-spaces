import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BOOKING_URLS, DASHBOARD_URLS } from '../../../shared/constants/urls/url';
import { BookingSelection, Space, BookingPlan } from '../../../shared/constants/space.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private selection: BookingSelection = {};

  constructor(private http: HttpClient) {}


  // Check availability
  checkAvailability(request: any): Observable<any> {
    return this.http.post(BOOKING_URLS.AVAILABILITY, request);
  }

  // Get available time slots for a specific date
  getAvailabilityGrid(spaceId: string, date: string): Observable<any> {
    return this.http.get(BOOKING_URLS.AVAILABILITY_GRID(spaceId, date));
  }

  // Get unavailable dates for a space in a month
  getUnavailableDates(spaceId: string, year: number, month: number): Observable<any> {
    return this.http.get(BOOKING_URLS.UNAVAILABLE_DATES(spaceId, year, month));
  }

  // Calculate price
  calculatePrice(request: any): Observable<any> {
    return this.http.post(BOOKING_URLS.CALCULATE_PRICE, request);
  }

  // Create booking
  createBooking(request: any): Observable<any> {
    return this.http.post(BOOKING_URLS.CREATE, request);
  }

  // Get all spaces
  getAllSpaces(): Observable<Space[]> {
    return this.http.get<Space[]>(BOOKING_URLS.SPACES);
  }

  // Get space by ID
  getSpaceById(id: string): Observable<Space> {
    return this.http.get<Space>(BOOKING_URLS.SPACE_BY_ID(id));
  }

  // Get dashboard stats
  getDashboardStats(): Observable<any> {
    return this.http.get(DASHBOARD_URLS.STATS);
  }

  // Get current user bookings
  getMyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${BOOKING_URLS.BASE}/me`);
  }

  // Cancel a booking
  cancelBooking(bookingId: number): Observable<any> {
    return this.http.patch(`${BOOKING_URLS.BASE}/${bookingId}/cancel`, {});
  }

  // --- Local selection cache for UI state only ---
  setPlan(plan: string) {
    this.selection.plan = plan as BookingPlan;
  }
  setDates(start: string, end?: string) {
    this.selection.date = start;
    if (end) {
      this.selection.endDate = end;
    } else {
      delete this.selection.endDate;
    }
  }
  setTimes(startTime: number, endTime: number) {
    this.selection.startTime = startTime;
    this.selection.endTime = endTime;
  }
  setPrice(price: number) {
    this.selection.price = price;
  }
  getPrice() {
    return this.selection.price;
  }
  getBookingDetails() {
    return this.selection;
  }
  getSelection(): BookingSelection {
    if (this.selection && Object.keys(this.selection).length > 0) {
      return this.selection;
    }
    const stored = localStorage.getItem('bookingSelection');
    if (!stored) return {};

    try {
      const parsed = JSON.parse(stored);
      this.selection = parsed;
      return parsed;
    } catch (e) {
      return {};
    }
  }
  setSelection(partial: Partial<BookingSelection>) {
    this.selection = { ...this.selection, ...partial };
    localStorage.setItem('bookingSelection', JSON.stringify(this.selection));
  }
  reset() {
    this.selection = {};
  }
  setQuantity(quantity: number) {
    this.selection.reservedUnits = quantity;
  }
}
