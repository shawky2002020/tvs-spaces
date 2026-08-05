import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SkeletonComponent {
  @Input() type: 'card' | 'detail' | 'dashboard' | 'text' | 'rect' = 'card';
  @Input() count: number = 1;

  get counterArray(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
