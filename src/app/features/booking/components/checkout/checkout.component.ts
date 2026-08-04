import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingSelection } from '../../../../shared/constants/space.model';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  selection: BookingSelection | undefined;
  loading = false;
  success = false;
  selectedPayment: 'card' | 'paypal' = 'card';
  bookingId: string = '';
  bookingReference: string = '';

  ngOnInit(): void {
    this.selection = this.bookingService.getSelection();
    if (!this.selection?.spaceId || !this.selection.date || !this.selection.plan) {
      this.router.navigate(['/dashboard/booking']);
    }
    this.bookingId = this.generateBookingId();
  }

  displayDate(): string {
    if (!this.selection?.date) return '';
    if (Array.isArray(this.selection.date)) {
      return this.selection.date
        .map((date) => this.formatDate(String(date)))
        .join(' - ');
    }
    const startFormatted = this.formatDate(String(this.selection.date));
    if (this.selection.endDate && this.selection.endDate !== this.selection.date) {
      return `${startFormatted} - ${this.formatDate(String(this.selection.endDate))}`;
    }
    return startFormatted;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  formatHour(hour: number | undefined): string {
    if (hour === undefined || hour === null) return '';
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:00 ${period}`;
  }

  getResourceName(): string {
    return this.selection?.space?.name || 'Space';
  }

  private generateBookingId(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  getPrice(): number {
    return this.selection?.price || 0;
  }

  canProceed(): boolean {
    return !!(
      this.selection?.spaceId &&
      this.selection.plan &&
      this.selection.date &&
      this.getPrice() > 0
    );
  }

  back(): void {
    this.location.back();
  }

  confirmBooking(): void {
    if (!this.canProceed() || !this.selection || this.loading) return;

    const dates = Array.isArray(this.selection.date)
      ? this.selection.date
      : this.selection.date
        ? [this.selection.date]
        : [];
    const firstDate = dates[0];
    if (!firstDate) {
      alert('Booking dates are missing. Please return to the date step.');
      return;
    }

    this.loading = true;

    const startDateStr = typeof firstDate === 'string' ? firstDate : new Date(firstDate).toISOString().slice(0, 10);
    const endDateStr = this.selection.endDate
      ? (typeof this.selection.endDate === 'string' ? this.selection.endDate : new Date(this.selection.endDate).toISOString().slice(0, 10))
      : dates[1]
        ? (typeof dates[1] === 'string' ? dates[1] : new Date(dates[1]).toISOString().slice(0, 10))
        : undefined;

    const request = {
      spaceId: this.selection.spaceId,
      plan: this.selection.plan,
      date: startDateStr,
      endDate: endDateStr,
      startTime: this.selection.startTime ?? 9,
      endTime: this.selection.endTime ?? 17,
      quantity: this.selection.reservedUnits ?? 1,
      paymentMethod: 'PAY_AT_VENUE',
    };

    this.bookingService.createBooking(request).subscribe({
      next: (response) => {
        this.bookingReference = response.reference || '';
        this.success = true;
        this.loading = false;
        this.bookingService.reset();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        const errorMessage =
          err.error?.message || 'Failed to place booking. Please try again.';
        alert(errorMessage);
      },
    });
  }
}
