import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { BookingPlan } from '../../../../shared/constants/space.model';

@Component({
  selector: 'app-plan-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="booking-step">
      <h2>Select a Plan</h2>
      <form (ngSubmit)="onNext()" #form="ngForm">
        <div class="plans">
          <label *ngFor="let p of plans">
            <input type="radio" name="plan" [(ngModel)]="plan" [value]="p" required (change)="onPlanChange()" />
            {{ p }}
          </label>
        </div>
        <div *ngIf="plan === 'Hourly'">
          <label>Start Time:
            <input type="time" name="startTime" [(ngModel)]="startTime" required />
          </label>
          <label>End Time:
            <input type="time" name="endTime" [(ngModel)]="endTime" required />
          </label>
        </div>
        <div *ngIf="plan === 'Monthly'">
          <p>Whole month will be booked. Time selection is disabled.</p>
        </div>
        <div class="actions">
          <button type="button" routerLink="../dates">Back</button>
          <button type="submit" [disabled]="!form.valid">Next</button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `.booking-step { padding: 2rem; max-width: 400px; margin: auto; }`,
    `.plans { display: flex; gap: 1rem; margin-bottom: 1rem; }`,
    `.actions { margin-top: 1rem; display: flex; gap: 1rem; }`
  ]
})
export class PlanSelectorComponent {
  bookingService = inject(BookingService);
  router = inject(Router);
  plans: BookingPlan[] = ['Hourly', 'Daily', 'Weekly', 'Monthly'];
  plan: BookingPlan | undefined;
  startTime: string = '';
  endTime: string = '';

  ngOnInit() {
    const sel = this.bookingService.getSelection();
    this.plan = sel.plan;
    if (sel.startTime) this.startTime = sel.startTime;
    if (sel.endTime) this.endTime = sel.endTime;
  }

  onPlanChange() {
    if (this.plan !== 'Hourly') {
      this.startTime = '';
      this.endTime = '';
    }
  }

  onNext() {
    // Save plan and time selection if needed
    const selection: any = { plan: this.plan };
    if (this.plan === 'Hourly') {
      selection.startTime = this.startTime;
      selection.endTime = this.endTime;
    }
    this.bookingService.setSelection(selection);
    this.router.navigate(['../summary'], { relativeTo: (this as any).router.routerState.root });
  }
}
