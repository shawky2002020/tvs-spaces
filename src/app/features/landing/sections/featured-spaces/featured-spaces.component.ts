import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingImageComponent } from '../../components/landing-image.component';
import { LandingSpaceCardComponent } from '../../components/landing-space-card.component';
import { RevealDirective } from '../../directives/reveal.directive';
import { CURRENCY, LandingCatalogState, LandingSpace } from '../../models/landing.model';
import { HeroPlan } from '../landing-hero/landing-hero.component';

@Component({
  selector: 'tvs-featured-spaces',
  standalone: true,
  imports: [RouterModule, LandingImageComponent, LandingSpaceCardComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './featured-spaces.component.html',
  styleUrls: ['./featured-spaces.component.scss'],
})
export class FeaturedSpacesComponent {
  @Input({ required: true }) state!: LandingCatalogState;
  @Input() selectedPlan: HeroPlan | null = null;
  @Output() retry = new EventEmitter<void>();

  readonly currency = CURRENCY;
  /** Skeleton count matches the real catalogue size so the box never jumps. */
  readonly skeletons = [0, 1, 2, 3];

  /**
   * The lead is chosen by a rule over live data, not pinned to an id: the desk
   * that can host the most people at once is the widest way into the product.
   */
  get lead(): LandingSpace | null {
    if (!this.state.spaces.length) return null;
    const desks = [...this.state.desks].sort((a, b) => b.capacity - a.capacity);
    return desks[0] ?? this.state.spaces[0];
  }

  get rest(): LandingSpace[] {
    const lead = this.lead;
    return lead ? this.state.spaces.filter((space) => space.id !== lead.id) : [];
  }

  get leadRates() {
    return this.lead?.rates ?? [];
  }
}
