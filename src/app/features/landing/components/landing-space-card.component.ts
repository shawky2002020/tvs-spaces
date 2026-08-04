import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingImageComponent } from './landing-image.component';
import { CURRENCY, LandingSpace } from '../models/landing.model';
import { HeroPlan } from '../sections/landing-hero/landing-hero.component';

/**
 * A catalogue entry.
 *
 * Everything shown comes from `GET /bookings/spaces`. The card carries exactly
 * one link, whose accessible name is the space name, so a grid of these never
 * produces repeated ambiguous link names. The visible action row is decorative
 * for assistive tech because the link's own label already describes it.
 */
@Component({
  selector: 'tvs-space-card',
  standalone: true,
  imports: [RouterModule, LandingImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card">
      <tvs-image
        class="card__plate"
        [src]="space.imageUrl"
        [alt]="'The ' + space.name + ' at TVS Spaces'"
        ratio="plate"
        [sizes]="imageSizes"
      />

      <div class="card__body">
        <div class="card__head">
          <h3 class="card__title">
            <a
              class="card__link"
              [routerLink]="space.detailRoute"
              [attr.aria-label]="space.name + ', see dates and prices'"
              >{{ space.name }}</a
            >
          </h3>
          <p class="card__kind">{{ space.kind === 'room' ? 'Meeting room' : 'Desk' }}</p>
        </div>

        <p class="card__capacity">{{ space.capacityLabel }}</p>

        @if (space.amenities.length) {
          <ul class="card__amenities">
            @for (amenity of space.amenities.slice(0, visibleAmenities); track amenity.name) {
              <li>
                <i class="fas fa-{{ amenity.icon }}" aria-hidden="true"></i>
                <span>{{ amenity.name }}</span>
              </li>
            }
            @if (space.amenities.length > visibleAmenities) {
              <li class="card__amenities-more">
                {{ space.amenities.length - visibleAmenities }} more on the detail page
              </li>
            }
          </ul>
        }

        <dl class="card__rates">
          @for (rate of space.rates; track rate.plan) {
            <div class="card__rate" [class.is-selected]="selectedPlan === rate.plan">
              <dt>{{ rate.label }}</dt>
              <dd>
                <span class="card__amount">{{ rate.amount }}</span>
                <span class="card__unit">{{ currency }} {{ rate.unit }}</span>
              </dd>
            </div>
          }
        </dl>

        <p class="card__action" aria-hidden="true">
          See dates and prices
          <svg viewBox="0 0 16 16" focusable="false">
            <path d="M2 8h11M9 4l4 4-4 4" />
          </svg>
        </p>
      </div>
    </article>
  `,
  styleUrls: ['./landing-space-card.component.scss'],
})
export class LandingSpaceCardComponent {
  @Input({ required: true }) space!: LandingSpace;
  @Input() selectedPlan: HeroPlan | null = null;
  @Input() imageSizes = '(min-width: 1180px) 25vw, (min-width: 640px) 45vw, 92vw';

  readonly currency = CURRENCY;
  /** Amenities are short labels, so four fit before the list needs a summary. */
  readonly visibleAmenities = 4;
}
