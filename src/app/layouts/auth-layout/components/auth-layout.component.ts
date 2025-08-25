import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
  standalone: false,
})
export class AuthLayoutComponent implements OnInit {
  pageTitle: string = 'Dashboard';
  user!: User 

  showUserDropdown: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.user = this.authService.User;
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        this.pageTitle =
          data['title'] || this.getPageTitleFromUrl(this.router.url);
        this.titleService.setTitle(`TVS Spaces - ${this.pageTitle}`);
      });
  }

  getPageTitleFromUrl(url: string): string {
    const segments = url.split('/');
    const lastSegment = segments[segments.length - 1];

    if (!lastSegment) return 'Dashboard';

    // Convert kebab-case or snake_case to Title Case
    return lastSegment
      .replace(/[-_]/g, ' ')
      .replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
  }

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }

  logout(): void {
    this.authService.logout();
  }
}
