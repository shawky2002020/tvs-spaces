import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../booking/services/booking.service';

interface DashboardBooking {
  id: number;
  reference: string;
  space: string;
  date: string;
  time: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  canCancel: boolean;
}

import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, SkeletonComponent],
})
export class DashboardComponent implements OnInit {
  private readonly bookingService = inject(BookingService);
  private readonly toastService = inject(ToastService);

  stats = [
    { title: 'Total Reservations', value: '0', icon: 'calendar-alt' },
    { title: 'Upcoming', value: '0', icon: 'clock' },
    { title: 'Active', value: '0', icon: 'door-open' },
    { title: 'Completed Visits', value: '0', icon: 'check-circle' },
  ];

  bookings: DashboardBooking[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.loadDashboard();
  }

  cancelBooking(booking: DashboardBooking): void {
    if (!booking.canCancel || !confirm(`Cancel booking ${booking.reference}?`)) return;

    this.bookingService.cancelBooking(booking.id).subscribe({
      next: () => {
        this.toastService.success(`Booking ${booking.reference} cancelled successfully.`);
        this.loadDashboard();
      },
      error: (err) => {
        const msg = err.error?.message || 'Unable to cancel this booking.';
        this.error = msg;
        this.toastService.error(msg, 'Cancellation Error');
      },
    });
  }

  private loadDashboard(): void {
    this.loading = true;
    this.error = '';
    this.loadStats();
    this.loadBookings();
  }

  private loadStats(): void {
    this.bookingService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = [
          {
            title: 'Total Reservations',
            value: String(data.totalReservations ?? 0),
            icon: 'calendar-alt',
          },
          {
            title: 'Upcoming',
            value: String(data.upcomingReservations ?? 0),
            icon: 'clock',
          },
          {
            title: 'Active',
            value: String(data.activeReservations ?? 0),
            icon: 'door-open',
          },
          {
            title: 'Completed Visits',
            value: String(data.totalVisits ?? 0),
            icon: 'check-circle',
          },
        ];
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Unable to load dashboard statistics.';
      },
    });
  }

  private loadBookings(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        const now = Date.now();
        this.bookings = data
          .map((booking) => {
            const start = new Date(booking.startAt);
            const end = new Date(booking.endAt);
            let status: DashboardBooking['status'];

            if (booking.status === 'CANCELLED') {
              status = 'CANCELLED';
            } else if (end.getTime() <= now) {
              status = 'COMPLETED';
            } else if (start.getTime() <= now) {
              status = 'ACTIVE';
            } else {
              status = 'UPCOMING';
            }

            return {
              id: booking.id,
              reference: booking.reference,
              space: booking.spaceName,
              date: start.toLocaleDateString(),
              time: `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
              status,
              canCancel: status === 'UPCOMING' || booking.status === 'CONFIRMED' || booking.status === 'PENDING',
              createdAt: new Date(booking.createdAt).getTime(),
            };
          })
          .sort((first, second) => second.createdAt - first.createdAt)
          .map(({ createdAt, ...booking }) => booking);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Unable to load your bookings.';
      },
    });
  }
}
