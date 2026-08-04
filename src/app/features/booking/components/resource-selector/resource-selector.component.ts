import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Space } from '../../../../shared/constants/space.model';
import { SpaceCardComponent } from '../../../../shared/components/space-card/space-card.component';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-resource-selector',
  standalone: true,
  imports: [CommonModule, SpaceCardComponent],
  templateUrl: './resource-selector.component.html',
  styleUrls: ['./resource-selector.component.scss'],
})
export class ResourceSelectorComponent implements OnInit {
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  spaces: Space[] = [];
  selectedSpaceId: string | null = null;
  loading = true;
  error = '';

  get rooms(): Space[] {
    return this.spaces.filter((space) => space.type === 'room');
  }

  get desks(): Space[] {
    return this.spaces.filter((space) => space.type === 'desk');
  }

  ngOnInit(): void {
    this.bookingService.getAllSpaces().subscribe({
      next: (spaces) => {
        this.spaces = spaces;
        this.selectedSpaceId = this.bookingService.getSelection().spaceId ?? null;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Unable to load workspaces.';
      },
    });
  }

  selectResource(id: string): void {
    this.selectedSpaceId = id;
  }

  next(): void {
    if (!this.selectedSpaceId || this.loading) return;

    const space = this.spaces.find((candidate) => candidate.id === this.selectedSpaceId);
    if (!space) {
      this.error = 'The selected workspace is no longer available.';
      return;
    }

    this.bookingService.setSelection({
      spaceId: space.id,
      space,
    });
    this.router.navigate(['dates'], { relativeTo: this.route });
  }
}
