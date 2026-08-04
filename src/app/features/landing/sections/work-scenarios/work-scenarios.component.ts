import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RevealDirective } from '../../directives/reveal.directive';
import {
  CURRENCY,
  LandingCatalogState,
  LandingPlanRate,
  LandingSpace,
  WORK_SCENARIO_SEEDS,
} from '../../models/landing.model';

interface ResolvedScenario {
  need: string;
  detail: string;
  space: LandingSpace;
  rate: LandingPlanRate;
}

@Component({
  selector: 'tvs-work-scenarios',
  standalone: true,
  imports: [RouterModule, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './work-scenarios.component.html',
  styleUrls: ['./work-scenarios.component.scss'],
})
export class WorkScenariosComponent {
  @Input({ required: true }) state!: LandingCatalogState;

  readonly currency = CURRENCY;

  /**
   * Editorial framing joined to live inventory. A scenario whose space is not in
   * the API response is dropped rather than rendered against placeholder data,
   * so this section can never describe something that is not bookable.
   */
  get scenarios(): ResolvedScenario[] {
    if (this.state.status !== 'ready') return [];

    return WORK_SCENARIO_SEEDS.reduce<ResolvedScenario[]>((resolved, seed) => {
      const space = this.state.spaces.find((candidate) => candidate.slug === seed.slug);
      if (!space) return resolved;

      const rate = space.rates.find((candidate) => candidate.plan === seed.recommendedPlan);
      if (!rate) return resolved;

      resolved.push({ need: seed.need, detail: seed.detail, space, rate });
      return resolved;
    }, []);
  }
}
