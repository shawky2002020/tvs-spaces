import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookingService } from '../../features/booking/services/booking.service';
import { BookingPlan, Space } from '../../shared/constants/space.model';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class RoomDetailComponent implements OnInit {
  space?: Space;
  loading = true;
  error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly bookingService: BookingService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('type');
    if (!slug) {
      this.router.navigate(['/']);
      return;
    }

    this.bookingService.getSpaceBySlug(slug).subscribe({
      next: (space) => {
        if (space.type !== 'room') {
          this.router.navigate(['/']);
          return;
        }
        this.space = space;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Room not found.';
      },
    });
  }

  selectPlan(plan: BookingPlan): void {
    if (!this.space) return;

    this.bookingService.setSelection({
      spaceId: this.space.id,
      space: this.space,
      plan,
    });
    this.router.navigate(['/dashboard/booking/dates']);
  }
}
