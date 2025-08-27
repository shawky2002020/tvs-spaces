import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  BookingService,
} from '../../services/booking.service';
import { BookingSelection } from '../../../../shared/constants/space.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  bookingService = inject(BookingService);
  router = inject(Router);
  selection: BookingSelection | undefined;
  loading = false;
  success = false;

  ngOnInit() {
    this.selection = this.bookingService.getSelection();
  }

  displayDate(): string {
    if (!this.selection?.date) return '';
    if (Array.isArray(this.selection.date)) {
      return this.selection.date
        .map((d: any) => d.toLocaleDateString())
        .join(' - ');
    }
    return (this.selection.date as Date).toLocaleDateString();
  }

  getPrice(): number {
    switch (this.selection?.plan) {
      case 'Hourly':
        if (this.selection.startTime && this.selection.endTime) {
          const [sh, sm] = this.selection.startTime.split(':').map(Number);
          const [eh, em] = this.selection.endTime.split(':').map(Number);
          const hours = eh + em / 60 - (sh + sm / 60);
          return Math.max(10, Math.round(hours * 10));
        }
        return 10;
      case 'Daily':
        return 50;
      case 'Weekly':
        return 200;
      case 'Monthly':
        return 600;
      default:
        return 0;
    }
  }

  payNow() {
    this.loading = true;
    setTimeout(() => {
      this.success = true;
      this.loading = false;
      this.bookingService.confirmBooking(this.selection!);
      setTimeout(() => {
        this.router.navigate(['/dashboard/bookings']);
      }, 1200);
    }, 1500);
  }
}
