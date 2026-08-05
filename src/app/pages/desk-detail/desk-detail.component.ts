import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { BookingService } from '../../features/booking/services/booking.service';
import { BookingPlan, Space } from '../../shared/constants/space.model';

import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-desk-detail',
  templateUrl: './desk-detail.component.html',
  standalone: true,
  styleUrls: ['./desk-detail.component.scss'],
  imports: [RouterModule, CommonModule, SkeletonComponent],
})
export class DeskDetailComponent implements OnInit {
  space?: Space;
  loading = true;
  error = '';
  previewImage: string | null = null;

  /** additionalImages minus the hero imageUrl to prevent gallery duplicates */
  get galleryImages(): string[] {
    if (!this.space) return [];
    return (this.space.additionalImages ?? []).filter(
      (img) => img !== this.space!.imageUrl
    );
  }

  openPreview(url: string): void {
    this.previewImage = url;
  }

  closePreview(): void {
    this.previewImage = null;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly bookingService: BookingService,
    private readonly titleService: Title,
    private readonly metaService: Meta
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('type');
    if (!slug) {
      this.router.navigate(['/']);
      return;
    }

    this.bookingService.getSpaceBySlug(slug).subscribe({
      next: (space) => {
        if (space.type !== 'desk') {
          this.router.navigate(['/']);
          return;
        }
        this.space = space;
        this.loading = false;

        // Dynamic SEO Update
        this.titleService.setTitle(`${space.name} | TVS Spaces Heliopolis`);
        this.metaService.updateTag({
          name: 'description',
          content: `Reserve your desk at ${space.name} in TVS Spaces Heliopolis, Cairo. ${space.description}`,
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Desk not found.';
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
