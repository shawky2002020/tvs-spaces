import {
  Component,
  inject,
  OnInit,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import {
  Space,
  BookingPlan,
  BookingSelection,
} from '../../../../shared/constants/space.model';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-date-plan-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  templateUrl: './date-plan-picker.component.html',
  styleUrls: ['./date-plan-picker.component.scss'],
})
export class DatePlanPickerComponent implements OnInit, OnChanges {
  bookingService = inject(BookingService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  route = inject(ActivatedRoute);

  space!: Space;
  selectedId: string | undefined;
  plan: BookingPlan = 'Hourly';
  quantity: number = 1;

  date: string | null = null; // YYYY-MM-DD
  endDate: string | null = null; // YYYY-MM-DD
  startTime: number = 9;
  endTime: number = 10;
  price: number = 0;
  error: string = '';
  loading: boolean = false;

  pickerDate: Date | null = null;
  pickerEndDate: Date | null = null;

  halfDayPeriod: 'morning' | 'afternoon' = 'morning';

  startHoursOptions = [9, 10, 11, 12, 13, 14, 15, 16, 17];
  endHoursOptions = [10, 11, 12, 13, 14, 15, 16, 17, 18];

  minDate = new Date();
  unavailableDates: string[] = [];

  // 7-day grid guide helper properties
  gridStartDay: number = new Date().getDate();
  gridDaysCount: number = 7;
  month: number = new Date().getMonth();
  year: number = new Date().getFullYear();
  daysInMonth: number = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  hoursGrid: number[] = Array.from({ length: 9 }, (_, i) => i + 9); // 9am - 5pm slots
  slotGrid: Array<{
    date: Date;
    slots: Array<{ hour: number; available: boolean }>;
  }> = [];

  ngOnInit() {
    this.initializeFromBookingService();
    this.updateUnavailableDates();
    this.generateSlotGrid();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['space'] && this.space) {
      this.updateUnavailableDates();
      this.generateSlotGrid();
    }
  }

  private initializeFromBookingService() {
    const sel = this.bookingService.getSelection();
    if (sel.space) {
      this.space = sel.space;
    } else {
      this.space = JSON.parse(localStorage.getItem('space') || '{}');
    }
    localStorage.setItem('space', JSON.stringify(this.space));

    if (sel.plan) {
      this.plan = sel.plan;
    }
    if (sel.date) {
      this.date = sel.date;
      this.pickerDate = new Date(sel.date + 'T00:00:00');
    }
    if (sel.endDate) {
      this.endDate = sel.endDate;
      this.pickerEndDate = new Date(sel.endDate + 'T00:00:00');
    }
    if (sel.startTime !== undefined) {
      this.startTime = sel.startTime;
    }
    if (sel.endTime !== undefined) {
      this.endTime = sel.endTime;
    }
    if (sel.reservedUnits) {
      this.quantity = sel.reservedUnits;
    }

    if (this.plan === 'Half-day') {
      this.halfDayPeriod = this.startTime === 14 ? 'afternoon' : 'morning';
    }

    if (this.date) {
      this.calculatePrice();
      this.validateAvailability();
    }
  }

  setPlan(plan: BookingPlan) {
    this.plan = plan;
    // Always clear dates when plan changes so picker starts fresh
    this.pickerDate = null;
    this.pickerEndDate = null;
    this.date = null;
    this.endDate = null;
    this.price = 0;
    this.error = '';

    if (plan === 'Hourly') {
      this.startTime = 9;
      this.endTime = 10;
    } else if (plan === 'Half-day') {
      this.halfDayPeriod = 'morning';
      this.startTime = 9;
      this.endTime = 13;
    } else {
      // Daily / Monthly — clear times too
      this.startTime = 9;
      this.endTime = 18;
    }
    this.generateSlotGrid();
  }

  setHalfDayPeriod(period: 'morning' | 'afternoon') {
    this.halfDayPeriod = period;
    this.startTime = period === 'morning' ? 9 : 14;
    this.endTime = period === 'morning' ? 13 : 18;
    this.calculatePrice();
    this.validateAvailability();
  }

  getDateFromValue(val: any): Date | null {
    if (!val) return null;
    if (val instanceof Date) return val;
    if (val._isAMomentObject && val._d instanceof Date) return val._d;
    if (typeof val.toDate === 'function') return val.toDate();
    return new Date(val);
  }

  formatDateToYYYYMMDD(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  onPickerDateChange(event: any) {
    const d = this.getDateFromValue(event.value);
    if (!d) {
      this.date = null;
    } else {
      this.date = this.formatDateToYYYYMMDD(d);
      if (this.plan === 'Hourly' || this.plan === 'Half-day') {
        this.endDate = this.date;
        this.pickerEndDate = d;
      }
    }
    this.calculatePrice();
    this.validateAvailability();
    this.generateSlotGrid();
  }

  selectSlot(selectedDate: Date, selectedHour: number) {
    this.date = this.formatDateToYYYYMMDD(selectedDate);
    this.pickerDate = selectedDate;
    this.pickerEndDate = selectedDate;
    this.endDate = this.date;
    this.startTime = selectedHour;
    this.endTime = selectedHour + 1; // default to 1 hour duration
    this.calculatePrice();
    this.validateAvailability();
    this.generateSlotGrid();
  }

  onPickerEndDateChange(event: any) {
    const d = this.getDateFromValue(event.value);
    this.endDate = d ? this.formatDateToYYYYMMDD(d) : null;
    this.calculatePrice();
    this.validateAvailability();
  }

  onTimeChange() {
    this.calculatePrice();
    this.validateAvailability();
  }

  onQuantityChange() {
    if (this.quantity < 1) this.quantity = 1;
    if (this.space.capacity && this.quantity > this.space.capacity) {
      this.quantity = this.space.capacity;
    }
    this.calculatePrice();
    this.validateAvailability();
  }

  isDateFree = (d: any): boolean => {
    const dateObj = this.getDateFromValue(d);
    if (!dateObj) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cleanDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    if (cleanDate < today) return false;

    const yyyymmdd = this.formatDateToYYYYMMDD(cleanDate);
    return !this.unavailableDates.includes(yyyymmdd);
  };

  private updateUnavailableDates() {
    if (!this.space || !this.space.id) return;
    const today = new Date();
    this.bookingService
      .getUnavailableDates(this.space.id, today.getFullYear(), today.getMonth() + 1)
      .subscribe({
        next: (res) => {
          this.unavailableDates = res.dates || [];
        },
        error: () => {
          this.unavailableDates = [];
        },
      });
  }

  calculatePrice() {
    if (!this.date || !this.space) {
      this.price = 0;
      return;
    }
    if (this.plan === 'Hourly' && this.endTime <= this.startTime) {
      this.price = 0;
      return;
    }
    if (this.plan === 'Daily' && this.endDate && this.endDate < this.date) {
      this.price = 0;
      return;
    }

    this.loading = true;
    const request = {
      spaceId: this.space.id,
      plan: this.plan,
      date: this.date,
      endDate: this.endDate || this.date,
      startTime: this.startTime,
      endTime: this.endTime,
      quantity: this.quantity,
    };

    this.bookingService.calculatePrice(request).subscribe({
      next: (res) => {
        this.price = res.price || 0;
        this.loading = false;
      },
      error: () => {
        this.price = 0;
        this.loading = false;
      },
    });
  }

  validateAvailability() {
    if (!this.date || !this.space) return;

    if (this.plan === 'Hourly' && this.endTime <= this.startTime) {
      this.error = 'End time must be after start time';
      return;
    }
    if (this.plan === 'Daily' && this.endDate && this.endDate < this.date) {
      this.error = 'End date must be after start date';
      return;
    }

    this.loading = true;
    const request = {
      spaceId: this.space.id,
      plan: this.plan,
      date: this.date,
      endDate: this.endDate || this.date,
      startTime: this.startTime,
      endTime: this.endTime,
      requestedUnits: this.quantity,
    };

    this.bookingService.checkAvailability(request).subscribe({
      next: (res) => {
        this.loading = false;
        if (!res.available) {
          this.error =
            this.quantity > 1
              ? 'Not enough units available for the selected period.'
              : 'The selected period is not available. Please choose a different date/time.';
        } else {
          this.error = '';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Error validating availability.';
      },
    });
  }

  get isFormValid(): boolean {
    if (!this.date) return false;
    if (this.plan === 'Hourly') {
      return this.endTime > this.startTime;
    }
    if (this.plan === 'Daily') {
      return !!this.endDate && this.endDate >= this.date;
    }
    return true;
  }

  formatHour(hour: number): string {
    if (hour === 12) return '12:00 PM';
    return hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
  }

  getPickerDateTimeTime(d: Date): number {
    const clean = new Date(d);
    clean.setHours(0,0,0,0);
    return clean.getTime();
  }

  next() {
    if (!this.isFormValid || this.error) {
      this.snackBar.open('Please resolve any errors before continuing.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.bookingService.setPlan(this.plan);
    this.bookingService.setDates(this.date!, this.endDate || this.date!);
    this.bookingService.setTimes(this.startTime, this.endTime);
    this.bookingService.setPrice(this.price);
    this.bookingService.setSelection({ reservedUnits: this.quantity });

    this.router.navigate(['../summary'], { relativeTo: this.route });
  }

  back() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // Availability grid guide logic
  nextDays() {
    this.daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    if (this.gridStartDay + this.gridDaysCount <= this.daysInMonth) {
      this.gridStartDay += this.gridDaysCount;
    } else if (this.month < 11) {
      this.month++;
      this.gridStartDay = 1;
    } else {
      this.month = 0;
      this.year++;
      this.gridStartDay = 1;
    }
    this.generateSlotGrid();
  }

  prevDays() {
    if (this.gridStartDay - this.gridDaysCount > 0) {
      this.gridStartDay -= this.gridDaysCount;
    } else if (this.month > 0) {
      this.month--;
      this.daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
      this.gridStartDay = this.daysInMonth - (this.daysInMonth % this.gridDaysCount || this.gridDaysCount) + 1;
    } else {
      this.month = 11;
      this.year--;
      this.daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
      this.gridStartDay = this.daysInMonth - (this.daysInMonth % this.gridDaysCount || this.gridDaysCount) + 1;
    }
    this.generateSlotGrid();
  }

  generateSlotGrid() {
    if (!this.space || !this.space.id) return;
    this.daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    this.slotGrid = [];
    const start = this.gridStartDay;
    const end = Math.min(start + this.gridDaysCount - 1, this.daysInMonth);
    for (let day = start; day <= end; day++) {
      const date = new Date(this.year, this.month, day);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (date < now) {
        const slots = this.hoursGrid.map(hour => ({ hour, available: false }));
        this.slotGrid.push({ date, slots });
      } else {
        const slots = this.hoursGrid.map(hour => ({ hour, available: false }));
        this.slotGrid.push({ date, slots });
        this.bookingService.getAvailabilityGrid(this.space.id, this.formatDateToYYYYMMDD(date)).subscribe({
          next: (response) => {
            const found = this.slotGrid.find(row => row.date.getTime() === date.getTime());
            if (found) {
              found.slots = this.hoursGrid.map(hour => {
                const slot = response.slots?.find((s: any) => s.hour === hour);
                return { hour, available: slot ? slot.available : false };
              });
            }
          },
          error: () => {
            // Keep unavailable on error
          }
        });
      }
    }
  }
}
