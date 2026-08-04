import {
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';

/**
 * Section entry motion.
 *
 * IntersectionObserver rather than a scroll listener, so nothing runs on the
 * main thread per frame. The element is fully visible in its resting state and
 * the directive only *adds* a starting offset when motion is allowed, which
 * means the page is complete with JavaScript disabled, with motion reduced, or
 * if the observer never fires.
 */
@Directive({
  selector: '[tvsReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  /** Stagger in milliseconds, for items revealing as a group. */
  @Input('tvsReveal') delay: number | string = 0;

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const element = this.host.nativeElement as HTMLElement;

    const prefersReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const delay = Number(this.delay) || 0;
    element.style.setProperty('--tvs-reveal-delay', `${delay}ms`);
    element.classList.add('tvs-reveal-armed');

    // Observer callbacks run outside Angular: this only toggles a class and must
    // not schedule change detection for the whole page on every scroll.
    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add('tvs-reveal-in');
            this.observer?.unobserve(entry.target);
          }
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
      );
      this.observer.observe(element);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = undefined;
  }
}
