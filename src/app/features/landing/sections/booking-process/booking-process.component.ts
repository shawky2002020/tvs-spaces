import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { CLOSING_HOUR, OPENING_HOUR, formatHour } from '../../models/landing.model';

interface ProcessStep {
  action: string;
  detail: string;
}

@Component({
  selector: 'tvs-booking-process',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './booking-process.component.html',
  styleUrls: ['./booking-process.component.scss'],
})
export class BookingProcessComponent {
  /**
   * The real sequence, matching the implemented flow: space detail page ->
   * /dashboard/booking/dates -> calculate-price -> POST /bookings, which returns
   * a booking reference. Step four states the sign-in requirement rather than
   * letting the visitor discover the auth wall on their own.
   */
  readonly steps: ProcessStep[] = [
    {
      action: 'Open a space',
      detail: 'Every desk and room has its own page with the rates, what is included, and how many units can be booked at once.',
    },
    {
      action: 'Choose date and hours',
      detail: `Pick a day and a window inside ${formatHour(OPENING_HOUR)} to ${formatHour(
        CLOSING_HOUR
      )}. Hours already taken by other bookings are shown as unavailable.`,
    },
    {
      action: 'See the total',
      detail: 'The price is calculated on the server from the rate and the hours you picked, and shown in full before you commit to anything.',
    },
    {
      action: 'Sign in and reserve',
      detail: 'Confirming needs an account. Once the reservation is placed you get a booking reference and it appears in your bookings.',
    },
  ];
}
