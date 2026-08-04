import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'tvs-final-cta',
  standalone: true,
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="close" aria-labelledby="close-heading">
      <div class="close__shell">
        <h2 id="close-heading" class="close__heading">Pick the space, then pick the hours.</h2>
        <p class="close__body">
          You already know what the work is, how many of you there are, and roughly how long it
          takes. The list has
          @if (spaceCount) {
            {{ spaceCount }} spaces
          } @else {
            every space
          }
          , three ways to book each one, and the price next to all of them.
        </p>
        <a class="close__cta" routerLink="/" fragment="spaces">See spaces and prices</a>
      </div>
    </section>
  `,
  styleUrls: ['./final-cta.component.scss'],
})
export class FinalCtaComponent {
  /** Bound to the live catalogue so the sentence cannot go stale. */
  @Input() spaceCount = 0;
}
