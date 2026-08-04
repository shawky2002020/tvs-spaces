import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingImageComponent } from '../../components/landing-image.component';
import { RevealDirective } from '../../directives/reveal.directive';
import {
  CLOSING_HOUR,
  HALF_DAY_HOURS,
  OPENING_HOUR,
  formatHour,
} from '../../models/landing.model';

export type HeroPlan = 'Hourly' | 'Half-day' | 'Daily';

interface HeroPlanBlock {
  plan: HeroPlan;
  label: string;
  window: string;
  /** Share of the 09:00-18:00 day this plan occupies, as a percentage. */
  span: number;
  offset: number;
}

const DAY_HOURS = CLOSING_HOUR - OPENING_HOUR;

@Component({
  selector: 'tvs-landing-hero',
  standalone: true,
  imports: [RouterModule, LandingImageComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing-hero.component.html',
  styleUrls: ['./landing-hero.component.scss'],
})
export class LandingHeroComponent {
  /** Which plan the catalogue is currently emphasising. */
  @Input() selectedPlan: HeroPlan | null = null;
  @Output() planPicked = new EventEmitter<HeroPlan>();

  readonly opening = formatHour(OPENING_HOUR);
  readonly closing = formatHour(CLOSING_HOUR);

  /**
   * The three plans the backend actually supports for a single visit, drawn to
   * scale against the real 09:00-18:00 day. Widths are computed, not designed,
   * so the diagram cannot drift from the booking rules.
   */
  readonly planBlocks: HeroPlanBlock[] = [
    {
      plan: 'Hourly',
      label: 'By the hour',
      window: `Any hours inside ${formatHour(OPENING_HOUR)} to ${formatHour(CLOSING_HOUR)}`,
      span: (1 / DAY_HOURS) * 100,
      offset: (2 / DAY_HOURS) * 100,
    },
    {
      plan: 'Half-day',
      label: 'Half day',
      window: `${HALF_DAY_HOURS} hours, ${formatHour(OPENING_HOUR)} to ${formatHour(
        OPENING_HOUR + HALF_DAY_HOURS
      )}`,
      span: (HALF_DAY_HOURS / DAY_HOURS) * 100,
      offset: 0,
    },
    {
      plan: 'Daily',
      label: 'Full day',
      window: `${formatHour(OPENING_HOUR)} to ${formatHour(CLOSING_HOUR)}, charged once`,
      span: 100,
      offset: 0,
    },
  ];

  /** Hour ticks across the rule, labelled every three hours. */
  readonly hourTicks = Array.from({ length: DAY_HOURS + 1 }, (_, index) => {
    const hour = OPENING_HOUR + index;
    return {
      hour,
      label: formatHour(hour),
      major: index % 3 === 0 || index === DAY_HOURS,
      position: (index / DAY_HOURS) * 100,
    };
  });

  pick(plan: HeroPlan): void {
    this.planPicked.emit(plan);
  }
}
