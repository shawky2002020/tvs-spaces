import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';

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
    { path: '/dashboard/facilities', label: 'Facilities', icon: 'info-circle' },
  ];

  isMobileMenuOpen: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

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
    this.authService.logout();
  }
}
