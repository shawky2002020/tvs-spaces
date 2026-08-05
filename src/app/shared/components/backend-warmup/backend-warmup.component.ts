import { Component, OnInit } from '@angular/core';
import { BackendWarmupService } from '../../../core/services/backend-warmup.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-backend-warmup',
  templateUrl: './backend-warmup.component.html',
  styleUrls: ['./backend-warmup.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class BackendWarmupComponent implements OnInit {
  isWarming$: Observable<boolean>;
  elapsedSeconds$: Observable<number>;
  retryCount$: Observable<number>;
  statusMessage$: Observable<string>;

  constructor(private warmupService: BackendWarmupService) {
    this.isWarming$ = this.warmupService.isWarming$;
    this.elapsedSeconds$ = this.warmupService.elapsedSeconds$;
    this.retryCount$ = this.warmupService.retryCount$;
    this.statusMessage$ = this.warmupService.statusMessage$;
  }

  ngOnInit(): void {
    // Warmup service automatically starts check on instantiation
  }
}
