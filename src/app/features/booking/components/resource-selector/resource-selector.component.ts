import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Space, SPACES } from '../../../../shared/constants/space.model';
import { SpaceCardComponent } from '../../../../shared/components/space-card/space-card.component';
import { DeskDetailComponent } from "../../../../pages/desk-detail/desk-detail.component";

@Component({
  selector: 'app-resource-selector',
  standalone: true,
  imports: [CommonModule, SpaceCardComponent, DeskDetailComponent],
  templateUrl: './resource-selector.component.html',
  styleUrls: ['./resource-selector.component.scss'],
})
export class ResourceSelectorComponent {
  bookingService = inject(BookingService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  spaces: Space[] = SPACES;
  selectedSpaceId: string | null = null;

  get rooms(): Space[] {
    return this.spaces.filter((s) => s.type === 'room');
  }
  get desks(): Space[] {
    return this.spaces.filter((s) => s.type === 'desk');
  }

  ngOnInit() {
    const sel = this.bookingService.getSelection();
    if (sel.spaceId) {
      this.selectedSpaceId = sel.spaceId;
    }
  }

  selectResource(id: string) {
    this.selectedSpaceId = id;
  }

  next() {
    if (!this.selectedSpaceId) return;
    this.bookingService.setSelection({ spaceId: this.selectedSpaceId });
    const space = this.spaces.find((s) => s.id === this.selectedSpaceId);
    if (space) {
      this.bookingService.setSelection({ space });
    }
    console.log(this.bookingService.getSelection());

    this.router.navigate(['dates'], { relativeTo: this.route });
  }
}
