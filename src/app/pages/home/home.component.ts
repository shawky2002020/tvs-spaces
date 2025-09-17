import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Space, SPACES } from '../../shared/constants/space.model';
import { BookingModule } from "../../features/booking/booking.module";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone:true,
  imports: [RouterModule, BookingModule]
})
export class HomeComponent {
  spaces: Space[] = SPACES;
    
    ngAfterViewInit() {
      // Add parallax effect to background images
      this.initParallaxEffect();
    }
  
    private initParallaxEffect() {
      const parallaxElements = document.querySelectorAll('.back.parallax img');
  
      window.addEventListener('scroll', () => {
        parallaxElements.forEach((element: Element) => {
          const section = element.closest('section');
          if (!section) return;
  
          const scrollPosition = window.pageYOffset;
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
  
          // Check if section is in viewport
          if (
            scrollPosition + window.innerHeight < sectionTop ||
            scrollPosition > sectionTop + sectionHeight
          ) {
            return;
          }
  
          // Calculate parallax offset
          const offset = (scrollPosition - sectionTop) * 0.4;
          (element as HTMLElement).style.transform = `translateY(${offset}px)`;
        });
      });
    }
}
