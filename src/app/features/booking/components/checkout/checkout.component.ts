import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingSelection } from '../../../../shared/constants/space.model';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  bookingService = inject(BookingService);
  router = inject(Router);
  location = inject(Location);
  selection: BookingSelection | undefined;
  loading = false;
  success = false;
  selectedPayment: 'card' | 'paypal' = 'card';
  bookingId: string = '';

  ngOnInit() {
    this.selection = this.bookingService.getSelection();
    if (!this.selection || !this.selection.spaceId) {
      this.router.navigate(['/book/select']);
    }
    this.bookingId = this.generateBookingId();
  }

  displayDate(): string {
    if (!this.selection?.date) return '';
    const startFormatted = this.formatDate(this.selection.date);
    if (this.selection.endDate && this.selection.endDate !== this.selection.date) {
      return `${startFormatted} - ${this.formatDate(this.selection.endDate)}`;
    }
    return startFormatted;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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

  selectPayment(method: 'card' | 'paypal') {
    this.selectedPayment = method;
  }

  canProceed(): boolean {
    return !!this.selection && !!this.selectedPayment;
  }

  back() {
    this.location.back();
  }

  payNow() {
    if (!this.canProceed() || !this.selection) return;

    this.loading = true;

    const request = {
      spaceId: this.selection.spaceId,
      plan: this.selection.plan,
      date: this.selection.date,
      endDate: this.selection.endDate,
      startTime: this.selection.startTime !== undefined ? this.selection.startTime : 9,
      endTime: this.selection.endTime !== undefined ? this.selection.endTime : 17,
      quantity: this.selection.reservedUnits || 1,
      paymentMethod: 'PAY_AT_VENUE'
    };

    this.bookingService.createBooking(request).subscribe({
      next: (response) => {
        this.success = true;
        this.loading = false;
        this.bookingService.reset();
        localStorage.removeItem('bookingSelection');

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.message || 'Failed to place booking. Please try again.';
        alert(errorMsg);
      }
    });
  }
}
