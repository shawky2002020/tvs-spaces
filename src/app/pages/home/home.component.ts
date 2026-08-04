import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookingModule } from '../../features/booking/booking.module';
import { BookingService } from '../../features/booking/services/booking.service';
import { Space } from '../../shared/constants/space.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [RouterModule, BookingModule],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  // The existing template references five indexes while the HTTP catalog is loading.
  // Empty placeholders prevent template evaluation errors without supplying mock data.
  spaces: Space[] = Array.from({ length: 5 }, () => ({ slug: '' } as Space));
  catalogLoading = true;
  catalogError = '';

  private catalogSubscription?: Subscription;
  private removeScrollListener?: () => void;

  constructor(private readonly bookingService: BookingService) {}

  ngOnInit(): void {
    this.catalogSubscription = this.bookingService.getAllSpaces().subscribe({
      next: (spaces) => {
        const orderedSpaces = [
          ...spaces.filter((space) => space.type === 'desk'),
          ...spaces.filter((space) => space.type === 'room'),
        ];
        this.spaces = orderedSpaces;
        this.catalogLoading = false;
      },
      error: (error) => {
        this.catalogLoading = false;
        this.catalogError = error.error?.message || 'Unable to load workspace details.';
      },
    });
  }

  ngAfterViewInit(): void {
    this.initParallaxEffect();
  }

  ngOnDestroy(): void {
    this.catalogSubscription?.unsubscribe();
    this.removeScrollListener?.();
  }

  private initParallaxEffect(): void {
    const parallaxElements = document.querySelectorAll('.back.parallax img');
    const onScroll = () => {
      parallaxElements.forEach((element: Element) => {
        const section = element.closest('section');
        if (!section) return;

        const scrollPosition = window.pageYOffset;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
          scrollPosition + window.innerHeight < sectionTop ||
          scrollPosition > sectionTop + sectionHeight
        ) {
          return;
        }

        const offset = (scrollPosition - sectionTop) * 0.4;
        (element as HTMLElement).style.transform = `translateY(${offset}px)`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    this.removeScrollListener = () => window.removeEventListener('scroll', onScroll);
  }
}
