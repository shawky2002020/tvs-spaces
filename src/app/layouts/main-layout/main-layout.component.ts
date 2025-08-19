import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { AppRoutingModule } from '../../app-routing-module';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { Space, SPACES } from '../../shared/models/space.model';
import { SpaceCardComponent } from "../../shared/components/space-card/space-card.component";
import { DeskDetailComponent } from "../../pages/desk-detail/desk-detail.component";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  standalone:false,
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
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
