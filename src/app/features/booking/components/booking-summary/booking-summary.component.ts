//
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { BookingSelection } from '../../../../shared/constants/space.model';
import { BookingService } from '../../services/booking.service';

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
  route = inject(ActivatedRoute);
  selection: BookingSelection | undefined;
  price!: number;

  ngOnInit() {
    this.selection = this.bookingService.getSelection();
    this.price = this.bookingService.getPrice() ?? 0;
    console.log('=== selection ===');
    console.log(this.selection);
  }

  displayDate(): string {
    if (!this.selection?.date) return '';
    const startFormatted = this.formatDateString(this.selection.date);
    if (this.selection.endDate && this.selection.endDate !== this.selection.date) {
      return `${startFormatted} - ${this.formatDateString(this.selection.endDate)}`;
    }
    return startFormatted;
  }

  formatDateString(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatHour(hour: number | undefined): string {
    if (hour === undefined || hour === null) return '';
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:00 ${period}`;
  }
  back() {
    this.router.navigate(['../dates'], {
      relativeTo: this.route,
    });
  }

  proceedToCheckout() {
    this.router.navigate(['../checkout'], {
      relativeTo: this.route,
    });
  }
}
