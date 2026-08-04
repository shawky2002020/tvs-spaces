import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

interface NavItem {
  label: string;
  fragment: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, AsyncPipe],
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  @ViewChild('sentinel') sentinel?: ElementRef<HTMLElement>;
  @ViewChild('panel') panel?: ElementRef<HTMLElement>;
  @ViewChild('toggle') toggle?: ElementRef<HTMLButtonElement>;

  isAuthPage(): boolean {
    return this.router.url.startsWith('/auth');
  }

  readonly user$ = this.auth.User$;

  /**
   * Every nav target is a fragment on the landing route, so these keep working
   * from a space detail page instead of dead-ending the way bare `#hash` links
   * did before.
   */
  readonly navItems: NavItem[] = [
    { label: 'Spaces', fragment: 'spaces' },
    { label: 'Rates', fragment: 'time' },
    { label: 'How it works', fragment: 'how-booking-works' },
  ];

  mobileMenuOpen = false;
  /** True once the page has scrolled past the top, which solidifies the bar. */
  pinned = false;

  private observer?: IntersectionObserver;
  private previouslyFocused: HTMLElement | null = null;

  ngAfterViewInit(): void {
    // A sentinel plus IntersectionObserver replaces a scroll listener: the
    // header state flips exactly once, with no work on every scroll frame.
    const sentinel = this.sentinel?.nativeElement;
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        const next = !entry.isIntersecting;
        if (next === this.pinned) return;
        this.pinned = next;
        this.cdr.markForCheck();
      },
      { threshold: 0 }
    );
    this.observer.observe(sentinel);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.releaseScrollLock();
  }

  openMobileMenu(): void {
    this.previouslyFocused = document.activeElement as HTMLElement | null;
    this.mobileMenuOpen = true;
    document.body.style.overflow = 'hidden';
    // Render synchronously before focusing: the panel is `inert` and hidden
    // while closed, and both refuse focus. Deferring with a microtask is not
    // enough, because change detection has not run by then.
    this.cdr.detectChanges();

    // Focus moves into the panel so the keyboard is never left behind the
    // overlay. The panel is `visibility: hidden` until `.is-open` lands, and a
    // still-hidden element refuses focus, so flush style before trying and fall
    // back to the next frame if the first attempt does not take.
    const panel = this.panel?.nativeElement;
    if (!panel) return;
    void panel.offsetHeight;
    panel.focus();
    if (!panel.contains(document.activeElement)) {
      requestAnimationFrame(() => panel.focus());
    }
  }

  closeMobileMenu(): void {
    if (!this.mobileMenuOpen) return;
    this.mobileMenuOpen = false;
    this.releaseScrollLock();
    this.cdr.markForCheck();
    // Focus returns to whatever opened the menu.
    (this.previouslyFocused ?? this.toggle?.nativeElement)?.focus();
    this.previouslyFocused = null;
  }

  logout(): void {
    this.closeMobileMenu();
    this.auth.logout();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.mobileMenuOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeMobileMenu();
      return;
    }

    if (event.key !== 'Tab') return;

    // Focus trap: Tab cycles inside the open panel rather than escaping to the
    // page behind it.
    const focusables = this.focusableElements();
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === this.panel?.nativeElement)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusableElements(): HTMLElement[] {
    const panel = this.panel?.nativeElement;
    if (!panel) return [];
    return Array.from(
      panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    ).filter((element) => element.offsetParent !== null);
  }

  private releaseScrollLock(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}
