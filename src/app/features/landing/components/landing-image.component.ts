import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

/** Widths generated into `assets/imgs/spaces/opt` as WebP. */
const OPTIMIZED_WIDTHS = [760, 1400];
const OPTIMIZED_PATTERN = /^(.*\/)([^/]+)\.(jpe?g|png)$/i;

/**
 * One image treatment for the whole landing page.
 *
 * - The wrapper owns the aspect ratio, so the box is reserved before the file
 *   arrives and the image contributes no layout shift.
 * - Below-the-fold images lazy-load and decode async; the hero opts in to eager.
 * - Source resolution degrades in two steps: optimized WebP set, then the
 *   original file the API gave us, then a drawn plan-figure. A missing or broken
 *   image never shows a browser error glyph.
 */
@Component({
  selector: 'tvs-image',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="plate" [ngClass]="'plate--' + ratio" [style.--tvs-plate-position]="position">
      @if (resolvedSrc) {
        <img
          [src]="resolvedSrc"
          [attr.srcset]="resolvedSrcset || null"
          [attr.sizes]="resolvedSrcset ? sizes || '100vw' : null"
          [alt]="alt"
          [attr.loading]="priority ? 'eager' : 'lazy'"
          [attr.fetchpriority]="priority ? 'high' : 'auto'"
          [attr.decoding]="priority ? 'sync' : 'async'"
          (error)="onError()"
        />
      } @else {
        <!-- Fallback: plan-drawing geometry, not an illustration. -->
        <span
          class="plate__fallback"
          role="img"
          [attr.aria-label]="alt || 'Workspace photograph unavailable'"
        >
          <svg viewBox="0 0 96 72" aria-hidden="true" focusable="false">
            <rect x="6.5" y="6.5" width="83" height="59" rx="1.5" />
            <path d="M6.5 46.5h83M34.5 46.5v19M34.5 6.5v18M62.5 24.5h27" />
          </svg>
        </span>
      }
    </figure>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .plate {
        position: relative;
        margin: 0;
        overflow: hidden;
        background: var(--tvs-ink-100);
        border-radius: inherit;
      }

      /*
        Each ratio reads through a custom property so a caller can override it
        at a breakpoint. Custom properties inherit into this component, which
        keeps responsive art direction possible without ::ng-deep.
      */
      .plate--wide { aspect-ratio: var(--tvs-plate-ratio, 16 / 9); }
      .plate--plate { aspect-ratio: var(--tvs-plate-ratio, 4 / 3); }
      .plate--tall { aspect-ratio: var(--tvs-plate-ratio, 3 / 4); }
      .plate--column { aspect-ratio: var(--tvs-plate-ratio, 2 / 3); }
      .plate--square { aspect-ratio: var(--tvs-plate-ratio, 1 / 1); }
      .plate--panorama { aspect-ratio: var(--tvs-plate-ratio, 21 / 9); }
      .plate--fill { block-size: 100%; }

      img {
        inline-size: 100%;
        block-size: 100%;
        display: block;
        object-fit: cover;
        object-position: var(--tvs-plate-position, 50% 50%);
      }

      .plate__fallback {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        background: var(--tvs-ink-100);
      }

      .plate__fallback svg {
        inline-size: 42%;
        max-inline-size: 96px;
        fill: none;
        stroke: var(--tvs-ink-400);
        stroke-width: 1;
        vector-effect: non-scaling-stroke;
      }
    `,
  ],
})
export class LandingImageComponent {
  @Input() set src(value: string) {
    this.original = value ?? '';
    this.stage = this.original ? 'optimized' : 'failed';
  }

  @Input() alt = '';
  @Input() ratio:
    | 'wide'
    | 'plate'
    | 'tall'
    | 'column'
    | 'square'
    | 'panorama'
    | 'fill' = 'plate';
  /** Above-the-fold images opt in to eager loading; everything else lazy-loads. */
  @Input() priority = false;
  @Input() sizes = '';
  /** `object-position`, so a wide interior shot can be anchored deliberately. */
  @Input() position = '50% 50%';

  private original = '';
  private stage: 'optimized' | 'original' | 'failed' = 'failed';

  get resolvedSrc(): string {
    if (this.stage === 'failed') return '';
    if (this.stage === 'original') return this.original;
    return this.optimized(OPTIMIZED_WIDTHS[OPTIMIZED_WIDTHS.length - 1]) || this.original;
  }

  get resolvedSrcset(): string {
    if (this.stage !== 'optimized') return '';
    const entries = OPTIMIZED_WIDTHS.map((width) => {
      const url = this.optimized(width);
      return url ? `${url} ${width}w` : '';
    }).filter(Boolean);
    return entries.length === OPTIMIZED_WIDTHS.length ? entries.join(', ') : '';
  }

  onError(): void {
    this.stage = this.stage === 'optimized' ? 'original' : 'failed';
  }

  /** `.../spaces/shared2.jpg` -> `.../spaces/opt/shared2-1400.webp`. */
  private optimized(width: number): string {
    const match = OPTIMIZED_PATTERN.exec(this.original);
    return match ? `${match[1]}opt/${match[2]}-${width}.webp` : '';
  }
}
