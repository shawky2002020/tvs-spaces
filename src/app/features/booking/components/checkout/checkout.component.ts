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
  bookingReference = '';

  ngOnInit(): void {
    this.selection = this.bookingService.getSelection();
    if (!this.selection?.spaceId || !this.selection.date || !this.selection.plan) {
      this.router.navigate(['/dashboard/booking']);
    }
  }

  displayDate(): string {
    if (!this.selection?.date) return '';
    if (Array.isArray(this.selection.date)) {
      return this.selection.date
        .map((date) => this.formatDate(date))
        .join(' - ');
    }
    return this.formatDate(this.selection.date);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  getResourceName(): string {
    return this.selection?.space?.name || 'Space';
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

    const startDate = new Date(firstDate);
    const endDate = dates[1] ? new Date(dates[1]) : undefined;

    const request = {
      spaceId: this.selection.spaceId,
      plan: this.selection.plan,
      date: startDate.toISOString().slice(0, 10),
      endDate: endDate?.toISOString().slice(0, 10),
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
