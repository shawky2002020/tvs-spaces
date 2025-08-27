import {
  Component,
  Input,
  inject,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core'; // ← Add this import
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import {
  Space,
  Availability,
  SPACES,
} from '../../../../shared/constants/space.model';
import { BookingService } from '../../services/booking.service';
import { SpaceAvailabilityUtils } from '../../../../shared/utils/SpaceAvailabilityUtils';

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
    MatMomentDateModule,
  ],
  templateUrl: './date-plan-picker.component.html',
  styleUrls: ['./date-plan-picker.component.scss'],
})
export class DatePlanPickerComponent implements OnInit, OnChanges {
  space !: Space ;
  bookingService = inject(BookingService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  selectedId :string | undefined;
  plan: 'Hourly' | 'Daily' | 'Monthly' = 'Hourly';
  date: Date | null = null;
  endDate: Date | null = null;
  startTime: string = '09:00';
  endTime: string = '17:00';
  price: number = 0;
  error: string = '';
  loading: boolean = false;

  // Time options for hourly booking
  timeOptions: string[] = this.generateTimeOptions();
  unavailableDates: Date[] = [];

  ngOnInit() {
    this.initializeFromBookingService();
    this.selectedId = this.bookingService.getBookingDetails().resourceId;
     const selspace = SPACES.filter((space)=>{      
       return space.id == this.selectedId
    })[0] ;
    if(selspace)
      this.space = selspace;
    console.log(selspace);
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['space'] && this.space) {
      this.updateUnavailableDates();
    }
  }

  private initializeFromBookingService() {
    const bookingData = this.bookingService.getSelection();
    if (bookingData.plan) {
      if (['Hourly', 'Daily', 'Monthly'].includes(bookingData.plan)) {
        this.plan = bookingData.plan as 'Hourly' | 'Daily' | 'Monthly';
      } else {
        this.plan = 'Hourly';
      }
      this.date != bookingData.date;
      this.endDate = bookingData.endTime ? new Date(bookingData.endTime) : null;
      this.startTime = bookingData.startTime || '09:00';
      this.endTime = bookingData.endTime || '17:00';
      this.calculatePrice();
    }
  }

  private updateUnavailableDates() {
    this.unavailableDates = SpaceAvailabilityUtils.getUnavailableDates(
      this.space
    );
  }

  private generateTimeOptions(): string[] {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        options.push(
          `${hour.toString().padStart(2, '0')}:${minute
            .toString()
            .padStart(2, '0')}`
        );
      }
    }
    return options;
  }

  get minDate(): Date {
    return new Date();
  }

  get maxDate(): Date {
    const max = new Date();
    max.setMonth(max.getMonth() + 3); // 3 months in advance
    return max;
  }

  get isHourly(): boolean {
    return this.plan === 'Hourly';
  }

  get isDaily(): boolean {
    return this.plan === 'Daily';
  }

  get isMonthly(): boolean {
    return this.plan === 'Monthly';
  }

  get isFormValid(): boolean {
    if (!this.date) return false;

    if (this.isHourly) {
      return !!this.startTime && !!this.endTime;
    }

    if (this.isDaily) {
      return !!this.endDate && this.endDate >= this.date;
    }

    if (this.isMonthly) {
      return true; // Date is already set to first day of month
    }

    return false;
  }

  onPlanChange() {
    this.date = null;
    this.endDate = null;
    this.startTime = '09:00';
    this.endTime = '17:00';
    this.price = 0;
    this.error = '';
  }

  onDateChange(selectedDate: Date | null) {
    this.date = selectedDate;
    this.error = '';

    if (this.isMonthly && selectedDate) {
      // Set to first and last day of month for monthly plan
      const firstDay = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      );
      const lastDay = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
      );

      this.date = firstDay;
      this.endDate = lastDay;
    } else if (this.isDaily) {
      // For daily plan, set end date to same as start date initially
      this.endDate = selectedDate;
    }

    this.calculatePrice();
    this.validateAvailability();
  }

  onEndDateChange(date: Date | null) {
    this.endDate = date;
    this.calculatePrice();
    this.validateAvailability();
  }

  onTimeChange() {
    this.calculatePrice();
    this.validateTimeRange();
  }

  validateTimeRange() {
    if (this.isHourly && this.startTime && this.endTime) {
      const [startHours, startMinutes] = this.startTime.split(':').map(Number);
      const [endHours, endMinutes] = this.endTime.split(':').map(Number);

      const startTotal = startHours * 60 + startMinutes;
      const endTotal = endHours * 60 + endMinutes;

      if (endTotal <= startTotal) {
        this.error = 'End time must be after start time';
      } else {
        this.error = '';
      }
    }
  }

  validateAvailability() {
    if (!this.date) return;

    if (this.isDateDisabled(this.date)) {
      this.error = 'Selected date is not available';
      return;
    }

    if (this.endDate && this.isDateDisabled(this.endDate)) {
      this.error = 'Selected end date is not available';
      return;
    }

    if (this.date && this.endDate) {
      const isAvailable = SpaceAvailabilityUtils.isSpaceAvailable(
        this.space,
        this.getStartDateTime(),
        this.getEndDateTime()
      );

      if (!isAvailable) {
        this.error = 'Selected period is not available';
      } else {
        this.error = '';
      }
    }
  }

  calculatePrice() {
    if (!this.space || !this.date) {
      this.price = 0;
      return;
    }

    try {
      if (this.isHourly && this.startTime && this.endTime) {
        const [startHours, startMinutes] = this.startTime
          .split(':')
          .map(Number);
        const [endHours, endMinutes] = this.endTime.split(':').map(Number);

        let hours =
          endHours + endMinutes / 60 - (startHours + startMinutes / 60);
        if (hours < 0) hours += 24;

        // Minimum 1 hour booking
        hours = Math.max(hours, 1);
        this.price = Math.ceil(this.space.pricing.hourly * hours);
      } else if (this.isDaily && this.date && this.endDate) {
        const days =
          Math.ceil(
            (this.endDate.getTime() - this.date.getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1;
        this.price = days * this.space.pricing.day;
      } else if (this.isMonthly && this.date && this.endDate) {
        // Use the appropriate monthly plan price
        this.price =
          this.space.pricing.lite ||
          this.space.pricing.pro ||
          this.space.pricing.max ||
          0;
      } else {
        this.price = 0;
      }
    } catch (error) {
      this.price = 0;
    }
  }

  getStartDateTime(): Date {
    if (!this.date) return new Date();

    const date = new Date(this.date);
    if (this.isHourly && this.startTime) {
      const [hours, minutes] = this.startTime.split(':').map(Number);
      date.setHours(hours, minutes, 0, 0);
    } else {
      date.setHours(9, 0, 0, 0); // Default to 9 AM
    }
    return date;
  }

  getEndDateTime(): Date {
    let endDate = this.endDate || this.date;
    if (!endDate) return new Date();

    const date = new Date(endDate);
    if (this.isHourly && this.endTime) {
      const [hours, minutes] = this.endTime.split(':').map(Number);
      date.setHours(hours, minutes, 0, 0);
    } else {
      date.setHours(17, 0, 0, 0); // Default to 5 PM
    }
    return date;
  }

// In your component class
isDateDisabled = (d: Date | null): boolean => {
  if (!d) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d < today) return true;
  
  if (d > this.maxDate) return true;
  
  // Check if date is in unavailable dates
  const isUnavailable = this.unavailableDates.some(unavailableDate => 
    unavailableDate.getDate() === d.getDate() &&
    unavailableDate.getMonth() === d.getMonth() &&
    unavailableDate.getFullYear() === d.getFullYear()
  );
  
  // Add custom class to unavailable dates
  if (isUnavailable) {
    setTimeout(() => this.addUnavailableDateClass(d));
  }
  
  return isUnavailable;
};

private addUnavailableDateClass(date: Date) {
  const dateCells = document.querySelectorAll('.mat-calendar-body-cell');
  dateCells.forEach(cell => {
    const cellDate = cell.getAttribute('aria-label');
    if (cellDate && cellDate.includes(date.toDateString())) {
      cell.classList.add('unavailable-date');
    }
  });
}

  next() {
    if (!this.isFormValid || this.error) {
      this.snackBar.open('Please complete all fields correctly.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    if (!this.validateBookingPeriod()) {
      return;
    }

    this.loading = true;

    try {
      this.bookingService.setPlan(this.plan);
      this.bookingService.setDates(
        this.getStartDateTime(),
        this.getEndDateTime()
      );

      if (this.isHourly) {
        this.bookingService.setTimes(this.startTime, this.endTime);
      }

      this.bookingService.setPrice(this.price);
      this.bookingService.setSpace(this.space);

      this.error = '';
      this.router.navigate(['/book/summary']);
    } catch (error) {
      this.snackBar.open(
        'Error processing booking. Please try again.',
        'Close',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
        }
      );
    } finally {
      this.loading = false;
    }
  }

  validateBookingPeriod(): boolean {
    if (!this.date) return false;

    const startDateTime = this.getStartDateTime();
    const endDateTime = this.getEndDateTime();

    if (endDateTime <= startDateTime) {
      this.snackBar.open(
        'End date/time must be after start date/time',
        'Close',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
        }
      );
      return false;
    }

    // Check if the selected period is available
    const isAvailable = SpaceAvailabilityUtils.isSpaceAvailable(
      this.space,
      startDateTime,
      endDateTime
    );

    if (!isAvailable) {
      this.snackBar.open(
        'The selected period is not available. Please choose different dates/times.',
        'Close',
        {
          duration: 5000,
          panelClass: ['error-snackbar'],
        }
      );
      return false;
    }

    return true;
  }

  back() {
    this.router.navigate(['../select']);
  }

  // Helper method to format date for display
  formatDate(date: Date | null): string {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  
}
