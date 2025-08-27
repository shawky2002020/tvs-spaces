//
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  BookingService,
} from '../../services/booking.service';
import { CommonModule } from '@angular/common';
import { BookingSelection } from '../../../../shared/constants/space.model';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.scss'],
})
export class BookingSummaryComponent implements OnInit {
  bookingService = inject(BookingService);
  router = inject(Router);
  selection: BookingSelection | undefined;

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
    // Dummy logic: Hourly = $10/hr, Daily = $50, Weekly = $200, Monthly = $600
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

  proceedToCheckout() {
    this.router.navigate(['../checkout'], {
      relativeTo: (this as any).router.routerState.root,
    });
  }
}
