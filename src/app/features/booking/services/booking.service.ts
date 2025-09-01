import { Injectable } from '@angular/core';
import { BookingPlan, BookingSelection, Space } from '../../../shared/constants/space.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private selection: BookingSelection = {};
  private confirmedBookings: BookingSelection[] = [];

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
    return this.selection ?? JSON.parse(localStorage.getItem('bookingSelection') || '{}');
  }

  setSelection(partial: Partial<BookingSelection>) {
    this.selection = { ...this.selection, ...partial };
    console.log(this.selection);
    
    localStorage.setItem('bookingSelection', JSON.stringify(this.selection));
    
  }

  reset() {
    this.selection = {};
  }

  confirmBooking(booking: BookingSelection) {
    this.confirmedBookings.push({ ...booking });
  }

  getConfirmedBookings(): BookingSelection[] {
    return this.confirmedBookings;
  }

  // Add method to set quantity
  setQuantity(quantity: number) {
    this.selection.reservedUnits = quantity;
  }
}
