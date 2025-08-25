import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.html',
  styleUrls: ['./side-bar.scss'],
  imports:[RouterModule,CommonModule]
})
export class SideBar implements OnInit {
  currentRoute: string = '';
  menuItems = [
    { path: '/dashboard', icon: 'home', label: 'Dashboard' },
    { path: '/dashboard/bookings', icon: 'calendar-check', label: 'My Bookings' },
    { path: '/dashboard/profile', icon: 'user', label: 'Profile' },
    { path: '/dashboard/payments', icon: 'credit-card', label: 'Payments' },
    { path: '/dashboard/support', icon: 'life-ring', label: 'Support' }
  ];
  
  isMobileMenuOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    // Implement logout functionality
    console.log('Logging out...');
    this.router.navigate(['/']);
  }
}
