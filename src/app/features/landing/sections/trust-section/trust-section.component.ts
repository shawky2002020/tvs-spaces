import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { CLOSING_HOUR, OPENING_HOUR, formatHour } from '../../models/landing.model';

interface TrustPoint {
  title: string;
  detail: string;
}

@Component({
  selector: 'tvs-trust-section',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './trust-section.component.html',
  styleUrls: ['./trust-section.component.scss'],
})
export class TrustSectionComponent {
  readonly opening = formatHour(OPENING_HOUR);
  readonly closing = formatHour(CLOSING_HOUR);

  /**
   * Each point describes a mechanism that exists in the product. There is no
   * rating, testimonial, customer count or certification here, because the
   * platform holds no data that would support one.
   */
  readonly points: TrustPoint[] = [
    {
      title: 'You pay at the venue',
      detail:
        'Reservations are placed with payment on arrival. No card number is asked for or stored on this site.',
    },
    {
      title: 'The total is worked out before you confirm',
      detail:
        'The price is calculated on the server from the space, the plan and the exact hours you picked, then shown to you. Nothing is added afterwards.',
    },
    {
      title: 'Availability is checked hour by hour',
      detail:
        'Each hour of your booking is compared against the reservations already held on that space. Hours that are taken cannot be selected.',
    },
    {
      title: 'Shared desks are counted, not guessed',
      detail:
        'Where a space has several units, the system tracks how many are already reserved for every hour and stops the booking if there are not enough left.',
    },
    {
      title: 'Your bookings stay in your account',
      detail:
        'Every reservation gets a reference and appears in your bookings list, where you can cancel it.',
    },
    {
      title: 'One address, stated hours',
      detail: `Everything on this page is in one building in Heliopolis, bookable between ${formatHour(
        OPENING_HOUR
      )} and ${formatHour(CLOSING_HOUR)}.`,
    },
  ];
}
