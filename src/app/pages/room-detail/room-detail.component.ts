import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Space, SPACES } from '../../shared/constants/space.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss'],
  standalone:true,
  imports: [RouterModule,CommonModule]
})
export class RoomDetailComponent implements OnInit {
  space: Space | undefined;
  selectedPlan: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('type');
    this.space = SPACES.find(s => s.type === 'room' && s.slug === slug);

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