import { Injectable } from '@angular/core';
import { BookingSelection, Space } from '../../../shared/constants/space.model';




@Injectable({ providedIn: 'root' })
export class BookingService {
  private selection: BookingSelection = {};
  private confirmedBookings: BookingSelection[] = [];

  setPlan(plan: string) {
    this.selection.resourceId = plan;
  }
  setSpace(space:Space){
    
  }

  setDates(start: Date, end: Date) {
    this.selection.date = start;
    if (start && end && start !== end) {
      this.selection.date = [start, end];
    }
  }

  setTimes(startTime: string, endTime: string) {
    this.selection.startTime = startTime;
    this.selection.endTime = endTime;
  }

  setPrice(price: number) {
    (this.selection as any).price = price;
  }

  getBookingDetails() {
    return this.selection;
  }

  getSelection(): BookingSelection {
    return this.selection;
  }

  setSelection(partial: Partial<BookingSelection>) {
    this.selection = { ...this.selection, ...partial };
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
}
