import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../booking/services/booking.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  bookingService = inject(BookingService);

  stats = [
    { title: 'Total Points', value: '0', icon: 'star' },
    { title: 'Total Visits', value: '0', icon: 'map-marker-alt' },
    { title: 'Total Reservations', value: '0', icon: 'calendar-alt' }
  ];

  recentBookings: any[] = [];

  recommendedSpaces = [
    { name: 'Solo Desk', image: 'assets/imgs/spaces/solo0.jpg', rating: 4.8 },
    { name: 'Team Room', image: 'assets/imgs/spaces/sm-meeting0.jpg', rating: 4.9 },
    { name: 'PC Station', image: 'assets/imgs/spaces/pc-station0.jpg', rating: 4.7 }
  ];

  ngOnInit(): void {
    this.loadStats();
    this.loadBookings();
  }

  loadStats() {
    this.bookingService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = [
          { title: 'Total Points', value: String(data.totalPoints || 0), icon: 'star' },
          { title: 'Total Visits', value: String(data.totalVisits || 0), icon: 'map-marker-alt' },
          { title: 'Total Reservations', value: String(data.totalReservations || 0), icon: 'calendar-alt' }
        ];
      },
      error: (err) => console.error('Error loading dashboard stats', err)
    });
  }

  loadBookings() {
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.recentBookings = data.map(b => ({
          id: b.reference,
          space: b.spaceName,
          date: new Date(b.startAt).toLocaleDateString(),
          time: `${new Date(b.startAt).getHours()}:00 - ${new Date(b.endAt).getHours()}:00`,
          status: b.status
        }));
      },
      error: (err) => console.error('Error loading user bookings', err)
    });
  }
}