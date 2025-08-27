import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Space, SPACES } from '../../../../shared/constants/space.model';
import { SpaceCardComponent } from '../../../../shared/components/space-card/space-card.component';

@Component({
  selector: 'app-resource-selector',
  standalone: true,
  imports: [CommonModule, SpaceCardComponent],
  templateUrl: './resource-selector.component.html',
  styleUrls: ['./resource-selector.component.scss'],
})
export class ResourceSelectorComponent {
  bookingService = inject(BookingService);
  router = inject(Router);

  spaces: Space[] = SPACES;
  selectedResourceId: string | null = null;

  get rooms(): Space[] {
    return this.spaces.filter((s) => s.type === 'room');
  }
  get desks(): Space[] {
    return this.spaces.filter((s) => s.type === 'desk');
  }

  ngOnInit() {
    const sel = this.bookingService.getSelection();
    if (sel.resourceId) {
      this.selectedResourceId = sel.resourceId;
    }
  }

  selectResource(id: string) {
    this.selectedResourceId = id;
  }

  next() {
    if (!this.selectedResourceId) return;
    this.bookingService.setSelection({ resourceId: this.selectedResourceId });
    console.log(this.bookingService.getSelection());
    
    this.router.navigateByUrl("dashboard/bookings/dates");
  }
}
