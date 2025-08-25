import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Space, SPACES } from '../../shared/constants/space.model';
import { AppRoutingModule } from '../../app-routing-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-desk-detail',
  templateUrl: './desk-detail.component.html',
  standalone: true,
  styleUrls: ['./desk-detail.component.scss'],
  imports: [RouterModule,CommonModule],
})
export class DeskDetailComponent implements OnInit {
  space: Space | undefined;
  selectedPlan: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('type');
    this.space = SPACES.find((s) => s.type === 'desk' && s.slug === slug);

    if (!this.space) {
      this.router.navigate(['/not-found']);
    }
  }
  selectPlan(plan: string, price: number) {
    this.selectedPlan = plan;
    setTimeout(() => {
      const el = document.getElementById('enquiry-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }
}
