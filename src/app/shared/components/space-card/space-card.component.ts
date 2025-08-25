import { Component, Input } from '@angular/core';
import { Space } from '../../constants/space.model';

@Component({
  selector: 'app-space-card',
  templateUrl: './space-card.component.html',
  styleUrls: ['./space-card.component.scss']
})
export class SpaceCardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() space: Space = {
    id: '',
    type: 'desk' as 'desk' | 'room',
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    additionalImages: [],
    amenities: [],
    pricing: {
      hourly: 0,
      halfDay: 0,
      day: 0,
      lite: 0,
      pro: 0,
      max: 0
    },
    capacity: 0,
    featured: false
  };
}
