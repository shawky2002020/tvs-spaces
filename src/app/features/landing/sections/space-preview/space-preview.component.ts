import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingImageComponent } from '../../components/landing-image.component';
import { RevealDirective } from '../../directives/reveal.directive';
import {
  CLOSING_HOUR,
  CURRENCY,
  LandingCatalogState,
  LandingSpace,
  OPENING_HOUR,
  formatHour,
} from '../../models/landing.model';

@Component({
  selector: 'tvs-space-preview',
  standalone: true,
  imports: [RouterModule, LandingImageComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './space-preview.component.html',
  styleUrls: ['./space-preview.component.scss'],
})
export class SpacePreviewComponent {
  @Input({ required: true }) state!: LandingCatalogState;

  readonly currency = CURRENCY;
  readonly hours = `${formatHour(OPENING_HOUR)} to ${formatHour(CLOSING_HOUR)}`;

  /**
   * The largest booking on the floor, chosen by rate rather than pinned to an
   * id, so this section follows the catalogue instead of hard-coding a winner.
   */
  get space(): LandingSpace | null {
    if (this.state.status !== 'ready') return null;
    const rooms = this.state.rooms.length ? this.state.rooms : this.state.spaces;
    if (!rooms.length) return null;

    return [...rooms].sort((a, b) => {
      const aRate = a.rates.find((rate) => rate.plan === 'Hourly')?.amount ?? 0;
      const bRate = b.rates.find((rate) => rate.plan === 'Hourly')?.amount ?? 0;
      return bRate - aRate;
    })[0];
  }

  /** Up to three supporting frames, excluding whatever is already the lead shot. */
  get gallery(): string[] {
    const space = this.space;
    if (!space) return [];
    return space.gallery.filter((url) => url !== space.imageUrl).slice(0, 3);
  }
}
