import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Space } from '../../../../shared/constants/space.model';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-date-plan-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatSnackBarModule],
  templateUrl: './date-plan-picker.component.html',
  styleUrls: ['./date-plan-picker.component.scss'],
})
export class DatePlanPickerComponent implements OnInit {
  space = {} as Space;
  plan: 'Hourly' | 'Daily' = 'Hourly';
  quantity = 1;

  date: Date | null = null;
  endDate: Date | null = null;
  startTime = 0;
  endTime = 0;
  price = 0;
  error = '';
  loading = false;

  bookedHours = 0;
  pricingPackage = '';

  readonly hoursGrid: number[] = Array.from({ length: 9 }, (_, index) => index + 9);
  slotGrid: Array<{
    date: Date;
    slots: Array<{ hour: number; available: boolean }>;
  }> = [];

  private gridStartDate = this.startOfDay(new Date());

  constructor(
    private readonly router: Router,
    private readonly bookingService: BookingService,
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const selection = this.bookingService.getSelection();
    if (!selection.spaceId) {
      this.router.navigate(['/dashboard/booking']);
      return;
    }

    if (selection.space) {
      this.space = selection.space;
      this.generateSlotGrid();
      return;
    }

    this.loading = true;
    this.bookingService.getSpaceById(selection.spaceId).subscribe({
      next: (space) => {
        this.space = space;
        this.bookingService.setSelection({ space, spaceId: space.id });
        this.loading = false;
        this.generateSlotGrid();
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load the selected space.';
      },
    });
  }

  get year(): number {
    return this.gridStartDate.getFullYear();
  }

  get month(): number {
    return this.gridStartDate.getMonth();
  }

  get isHourly(): boolean {
    return this.plan === 'Hourly';
  }

  get isDaily(): boolean {
    return this.plan === 'Daily';
  }

  get isFormValid(): boolean {
    if (!this.date || this.price <= 0) return false;
    if (this.isHourly) {
      return this.startTime >= 9 && this.endTime > this.startTime && this.endTime <= 18;
    }
    return !!this.endDate;
  }

  nextDays(): void {
    this.gridStartDate = this.addDays(this.gridStartDate, 7);
    this.generateSlotGrid();
  }

  prevDays(): void {
    const candidate = this.addDays(this.gridStartDate, -7);
    const today = this.startOfDay(new Date());
    this.gridStartDate = candidate < today ? today : candidate;
    this.generateSlotGrid();
  }

  generateSlotGrid(): void {
    if (!this.space.id) return;

    this.slotGrid = Array.from({ length: 7 }, (_, index) => {
      const date = this.addDays(this.gridStartDate, index);
      return {
        date,
        slots: this.hoursGrid.map((hour) => ({ hour, available: false })),
      };
    });

    for (const row of this.slotGrid) {
      if (row.date < this.startOfDay(new Date())) continue;

      this.bookingService
        .getAvailabilityGrid(this.space.id, this.formatApiDate(row.date))
        .subscribe({
          next: (response) => {
            row.slots = this.hoursGrid.map((hour) => {
              const slot = response.slots?.find(
                (candidate: { hour: number; available: boolean }) => candidate.hour === hour
              );
              return { hour, available: !!slot?.available };
            });
          },
          error: () => {
            row.slots = this.hoursGrid.map((hour) => ({ hour, available: false }));
          },
        });
    }
  }

  selectSlot(selectedDate: Date, selectedHour: number): void {
    this.date = this.startOfDay(selectedDate);
    this.endDate = this.startOfDay(selectedDate);

    if (this.isHourly) {
      this.startTime = selectedHour;
      this.endTime = selectedHour + 1;
      this.bookedHours = 1;
    } else {
      this.startTime = 9;
      this.endTime = 18;
      this.bookedHours = 9;
    }

    this.error = '';
    this.calculatePrice();
    this.validateAvailability();
  }

  onPlanChange(): void {
    this.date = null;
    this.endDate = null;
    this.startTime = 0;
    this.endTime = 0;
    this.bookedHours = 0;
    this.price = 0;
    this.error = '';
    this.pricingPackage = '';
  }

  onQuantityChange(): void {
    this.quantity = Math.max(1, Math.min(this.quantity, this.space.capacity || 1));
    if (this.date) {
      this.calculatePrice();
      this.validateAvailability();
    }
  }

  calculatePrice(): void {
    if (!this.date || !this.space.id || !this.startTime || !this.endTime) {
      this.price = 0;
      return;
    }

    this.bookingService.calculatePrice(this.buildRequest()).subscribe({
      next: (response) => {
        this.price = Number(response.price) || 0;
        this.pricingPackage = this.plan;
      },
      error: (err) => {
        this.price = 0;
        this.error = err.error?.message || 'Unable to calculate the booking price.';
      },
    });
  }

  validateAvailability(): void {
    if (!this.date || !this.space.id || !this.startTime || !this.endTime) return;

    this.bookingService.checkAvailability({
      ...this.buildRequest(),
      requestedUnits: this.quantity,
    }).subscribe({
      next: (response) => {
        this.error = response.available ? '' : 'Selected period is not available.';
      },
      error: (err) => {
        this.error = err.error?.message || 'Unable to check availability.';
      },
    });
  }

  next(): void {
    if (!this.isFormValid || this.error || this.loading || !this.date || !this.endDate) {
      this.snackBar.open('Please select an available booking period.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.loading = true;
    this.bookingService.checkAvailability({
      ...this.buildRequest(),
      requestedUnits: this.quantity,
    }).subscribe({
      next: (response) => {
        this.loading = false;
        if (!response.available) {
          this.error = 'Selected period is no longer available.';
          return;
        }

        this.bookingService.setSelection({
          spaceId: this.space.id,
          space: this.space,
          plan: this.plan,
          date: this.date,
          startTime: this.startTime,
          endTime: this.endTime,
          price: this.price,
          reservedUnits: this.quantity,
        });
        this.router.navigate(['../summary'], { relativeTo: this.route });
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Unable to verify availability.';
      },
    });
  }

  back(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  getPackagePrice(): number {
    if (!this.space.pricing) return 0;
    return this.isHourly ? this.space.pricing.hourly : this.space.pricing.day;
  }

  private buildRequest(): {
    spaceId: string;
    plan: 'Hourly' | 'Daily';
    date: string;
    endDate: string;
    startTime: number;
    endTime: number;
    quantity: number;
  } {
    const endDate = this.endDate ?? this.date ?? new Date();
    return {
      spaceId: this.space.id,
      plan: this.plan,
      date: this.formatApiDate(this.date ?? new Date()),
      endDate: this.formatApiDate(endDate),
      startTime: this.startTime,
      endTime: this.endTime,
      quantity: this.quantity,
    };
  }

  private formatApiDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return this.startOfDay(result);
  }
}
