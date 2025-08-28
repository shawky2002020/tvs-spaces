import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { BookingSelection, SPACES } from '../../../../shared/constants/space.model';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

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
    if (!this.selection?.spaceId) return 'Space';
    const space = SPACES.find(s => s.id === this.selection?.spaceId);
    return space ? space.name : 'Space';
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
    if (!this.canProceed()) return;
    
    this.loading = true;
    
    // Simulate payment processing
    setTimeout(() => {
      this.success = true;
      this.loading = false;
      
      if (this.selection) {
        this.bookingService.confirmBooking(this.selection);
      }
      
      setTimeout(() => {
        this.router.navigate(['/dashboard/bookings']);
      }, 2000);
    }, 1500);
  }
}
