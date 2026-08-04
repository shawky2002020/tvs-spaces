import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RevealDirective } from '../../directives/reveal.directive';
import {
  CLOSING_HOUR,
  CURRENCY,
  HALF_DAY_HOURS,
  LandingCatalogState,
  OPENING_HOUR,
  formatHour,
} from '../../models/landing.model';

/** The worked example is a 3 hour visit: short enough to be realistic, long
 *  enough to show what "charged per hour" actually costs. */
const EXAMPLE_HOURS = 3;

interface CostRow {
  id: string;
  name: string;
  kind: string;
  route: (string | number)[];
  hourlyRate: number;
  exampleTotal: number;
  halfDay: number;
  fullDay: number;
  /** True when the flat day rate undercuts the worked hourly example. */
  dayBeatsHours: boolean;
}

@Component({
  selector: 'tvs-time-based-booking',
  standalone: true,
  imports: [RouterModule, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './time-based-booking.component.html',
  styleUrls: ['./time-based-booking.component.scss'],
})
export class TimeBasedBookingComponent {
  @Input({ required: true }) state!: LandingCatalogState;

  readonly currency = CURRENCY;
  readonly exampleHours = EXAMPLE_HOURS;
  readonly halfDayHours = HALF_DAY_HOURS;
  readonly opening = formatHour(OPENING_HOUR);
  readonly closing = formatHour(CLOSING_HOUR);
  readonly halfDayEnd = formatHour(OPENING_HOUR + HALF_DAY_HOURS);
  readonly dayLength = CLOSING_HOUR - OPENING_HOUR;

  /**
   * Every number here is computed with the same arithmetic the backend uses in
   * `calculatePriceInternal`: hourly multiplies by hours, half-day and daily are
   * flat. Nothing is typed in by hand.
   */
  get rows(): CostRow[] {
    if (this.state.status !== 'ready') return [];

    return this.state.spaces.map((space) => {
      const hourly = space.rates.find((rate) => rate.plan === 'Hourly')!;
      const halfDay = space.rates.find((rate) => rate.plan === 'Half-day')!;
      const fullDay = space.rates.find((rate) => rate.plan === 'Daily')!;
      const exampleTotal = hourly.amount * EXAMPLE_HOURS;

      return {
        id: space.id,
        name: space.name,
        kind: space.kind === 'room' ? 'Meeting room' : 'Desk',
        route: space.detailRoute,
        hourlyRate: hourly.amount,
        exampleTotal,
        halfDay: halfDay.amount,
        fullDay: fullDay.amount,
        dayBeatsHours: fullDay.amount < exampleTotal,
      };
    });
  }

  /**
   * Counted rather than asserted: the sentence about day rates undercutting the
   * hourly example stays true if the rate card ever changes.
   */
  get dayBeatsHoursCount(): number {
    return this.rows.filter((row) => row.dayBeatsHours).length;
  }
}
