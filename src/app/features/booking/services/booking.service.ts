import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  BookingPlan,
  BookingSelection,
  Space,
} from '../../../shared/constants/space.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = '/api/bookings';
  private selection: BookingSelection = {};

  constructor(private http: HttpClient) {}

  // --- Backend API Calls ---

  // Check availability
  checkAvailability(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/availability`, request);
  }

  // Get available time slots for a specific date
  getAvailabilityGrid(spaceId: string, date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${spaceId}/availability/${date}`);
  }

  // Get unavailable dates for a space in a month
  getUnavailableDates(
    spaceId: string,
    year: number,
    month: number
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/${spaceId}/unavailable-dates/${year}/${month}`
    );
  }

  // Calculate price
  calculatePrice(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/calculate-price`, request);
  }

  // Create booking
  createBooking(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, request);
  }

  // Get all spaces
  getAllSpaces(): Observable<Space[]> {
    return this.http.get<Space[]>(`${this.apiUrl}/spaces`);
  }

  // Get space by ID
  getSpaceById(id: string): Observable<Space> {
    return this.http.get<Space>(`${this.apiUrl}/spaces/${id}`);
  }

  // --- Local selection cache for UI state only ---
  setPlan(plan: string) {
    this.selection.plan = plan as BookingPlan;
  }
  setDates(start: Date, end: Date) {
    this.selection.date = start;
    if (start && end && start !== end) {
      this.selection.date = [start, end];
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
    return (
      this.selection ??
      JSON.parse(localStorage.getItem('bookingSelection') || '{}')
    );
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
