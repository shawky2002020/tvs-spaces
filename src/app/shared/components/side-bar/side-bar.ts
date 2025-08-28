import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.html',
  standalone: true,
  styleUrls: ['./side-bar.scss'],
  imports: [RouterModule, CommonModule],
})
export class SideBar implements OnInit {
  currentRoute: string = '';
  menuItems = [
    { path: '/dashboard', icon: 'home', label: 'Dashboard' },
    { path: '/dashboard/profile', icon: 'user', label: 'Profile' },

    { path: '/dashboard/booking', label: 'Spaces', icon: 'door-open' },

    { path: '/kitchen', label: 'Kitchen', icon: 'utensils' },
    // { path: '/dashboard/payments', icon: 'credit-card', label: 'Payments' },
    // { path: '/dashboard/support', icon: 'life-ring', label: 'Support' },
    { path: '/dashboard/facilities', label: 'Facilities', icon: 'info-circle' },
  ];

  isMobileMenuOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    // Implement logout functionality
    this.router.navigate(['/']);
  }
}
