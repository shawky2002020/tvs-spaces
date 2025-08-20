import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Space, SPACES } from '../../shared/models/space.model';
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
  
  constructor(private route: ActivatedRoute, private router: Router) {
    window.screenY = 0;
  }
  
  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('type');
    this.space = SPACES.find(s => s.type === 'room' && s.slug === slug);
    
    if (!this.space) {
      this.router.navigate(['/not-found']);
    }
  }
}