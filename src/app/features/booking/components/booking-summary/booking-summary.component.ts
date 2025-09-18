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
    if (Array.isArray(this.selection.date)) {
      return this.selection.date
        .map((d: any) => d.toLocaleDateString())
        .join(' - ');
    }
    return (this.selection.date as Date).toLocaleDateString();
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
