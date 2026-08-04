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

  ngOnInit() {
    this.selection = this.bookingService.getSelection();
    if (!this.selection || !this.selection.spaceId) {
      this.router.navigate(['/book/select']);
    }
  }

  displayDate(): string {
    if (!this.selection?.date) return '';
    if (Array.isArray(this.selection.date)) {
      return this.selection.date
        .map((d: any) => this.formatDate(d))
        .join(' - ');
    }
    return this.formatDate(this.selection.date as Date);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getResourceName(): string {
    return this.selection?.space?.name || 'Space';
  }

  generateBookingId(): string {
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

    let dateVal: Date;
    let endDateVal: Date | undefined;

    if (Array.isArray(this.selection.date)) {
      dateVal = new Date(this.selection.date[0]);
      endDateVal = new Date(this.selection.date[1]);
    } else {
      dateVal = new Date(this.selection.date as Date);
      endDateVal = undefined;
    }

    const request = {
      spaceId: this.selection.spaceId,
      plan: this.selection.plan,
      date: dateVal.toISOString().slice(0, 10),
      endDate: endDateVal ? endDateVal.toISOString().slice(0, 10) : undefined,
      startTime: this.selection.startTime || 9,
      endTime: this.selection.endTime || 17,
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
