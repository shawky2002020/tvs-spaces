import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { User } from '../../../shared/models/user.model';
import { SideBar } from '../../../shared/components/side-bar/side-bar';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
  standalone: false,
})
export class AuthLayoutComponent implements OnInit {
  @ViewChild(SideBar) sidebarComponent!: SideBar;
  pageTitle: string = 'Dashboard';
  user: User | null = {} as User;

  showUserDropdown: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.user = this.authService.User;
    this.updateTitle();
    
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.updateTitle();
      });
  }

  updateTitle(): void {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const data = route.snapshot.data;
    // Check if there is a custom page title in the route data, otherwise fallback to URL segment parsing
    const title = data['title'] || this.getPageTitleFromUrl(this.router.url);
    // Strip trailing ' | TVS Spaces' if it exists in router title definition
    this.pageTitle = title.replace(/\s*\|\s*TVS\s*Spaces/i, '');
    this.titleService.setTitle(`TVS Spaces - ${this.pageTitle}`);
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

  toggleSidebar(): void {
    if (this.sidebarComponent) {
      this.sidebarComponent.toggleMobileMenu();
    }
  }
}
