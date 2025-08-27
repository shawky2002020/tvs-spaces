import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  // Dashboard statistics
  stats = [
    { title: 'Total Points', value: '120', icon: 'star' },
    { title: 'Total Visits', value: '15', icon: 'map-marker-alt' },
    { title: 'Total Reservations', value: '8', icon: 'calendar-alt' }
  ];
  
  // Recent bookings
  recentBookings = [
    { id: 'BK-1001', space: 'Team Room', date: '2023-06-15', time: '09:00 - 17:00', status: 'Completed' },
    { id: 'BK-1002', space: 'Solo Desk', date: '2023-06-18', time: '10:00 - 18:00', status: 'Active' },
    { id: 'BK-1003', space: 'Big Meeting Room', date: '2023-06-20', time: '13:00 - 15:00', status: 'Upcoming' }
  ];
  
  // Recommended spaces
  recommendedSpaces = [
    { name: 'Solo Desk', image: 'assets/imgs/spaces/solo0.jpg', rating: 4.8 },
    { name: 'Team Room', image: 'assets/imgs/spaces/sm-meeting0.jpg', rating: 4.9 },
    { name: 'PC Station', image: 'assets/imgs/spaces/pc-station0.jpg', rating: 4.7 }
  ];

  constructor() {}

  ngOnInit(): void {}
}