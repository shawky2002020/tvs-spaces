import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LandingCatalogService } from './services/landing-catalog.service';
import { LandingHeroComponent, HeroPlan } from './sections/landing-hero/landing-hero.component';
import { FeaturedSpacesComponent } from './sections/featured-spaces/featured-spaces.component';
import { WorkScenariosComponent } from './sections/work-scenarios/work-scenarios.component';
import { BookingProcessComponent } from './sections/booking-process/booking-process.component';
import { TimeBasedBookingComponent } from './sections/time-based-booking/time-based-booking.component';
import { SpacePreviewComponent } from './sections/space-preview/space-preview.component';
import { TrustSectionComponent } from './sections/trust-section/trust-section.component';
import { FinalCtaComponent } from './sections/final-cta/final-cta.component';

/**
 * Landing page shell.
 *
 * Owns the two pieces of page-level state (the catalogue and which plan the
 * visitor is comparing on) and hands both down to purely presentational
 * sections. One HTTP request serves the whole page.
 */
@Component({
  selector: 'app-landing-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    LandingHeroComponent,
    FeaturedSpacesComponent,
    WorkScenariosComponent,
    BookingProcessComponent,
    TimeBasedBookingComponent,
    SpacePreviewComponent,
    TrustSectionComponent,
    FinalCtaComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  private readonly catalog = inject(LandingCatalogService);

  readonly state$ = this.catalog.state$;
  selectedPlan: HeroPlan | null = null;

  /**
   * The hero's plan controls are a real discovery shortcut: picking one
   * re-weights every rate in the catalogue and moves the visitor to it.
   * Picking the same plan again clears the emphasis.
   */
  onPlanPicked(plan: HeroPlan): void {
    this.selectedPlan = this.selectedPlan === plan ? null : plan;
    if (this.selectedPlan) {
      this.scrollToSpaces();
    }
  }

  retry(): void {
    this.catalog.reload();
  }

  private scrollToSpaces(): void {
    if (typeof document === 'undefined') return;

    const target = document.getElementById('spaces');
    if (!target) return;

    const prefersReduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    target.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'start',
    });
    // Move focus with the scroll so keyboard users land where the page moved.
    target.focus({ preventScroll: true });
  }
}
