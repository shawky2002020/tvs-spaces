import {
  Component,
  Input,
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
export class DatePlanPickerComponent
  implements OnInit, OnChanges, AfterViewInit
{
  space!: Space;
  // bookingService = inject(BookingService);
  // router = inject(Router);
  // snackBar = inject(MatSnackBar);
  // location = inject(Location);
  selectedId: string | undefined;
  plan: 'Hourly' | 'Daily' | 'Monthly' = 'Hourly';
  date: Date | null = null;
  endDate: Date | null = null;
  startTime: string = '10:00';
  endTime: string = '17:00';
  price: number = 0;
  error: string = '';
  loading: boolean = false;
  constructor(
    private router: Router,
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute
  ) {}
  ngAfterViewInit(): void {
    this.styleUnavailableDates();
  }
  // Time options for hourly booking
  timeOptions: string[] = this.generateTimeOptions();
  unavailableDates: Date[] = [];

  ngOnInit() {
    this.initializeFromBookingService();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['space'] && this.space) {
      this.updateUnavailableDates();
    }
  }

  private initializeFromBookingService() {
    this.selectedId = this.bookingService.getBookingDetails().spaceId;
    const selspace = SPACES.filter((space) => {
      return space.id == this.selectedId;
    })[0];
    if (selspace) this.space = selspace;
    else this.space = JSON.parse(localStorage.getItem('space') || '{}');

    
    this.updateUnavailableDates();
    localStorage.setItem('space', JSON.stringify(this.space));

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

  // get maxDate(): Date {
  //   const max = new Date();
  //   return max;
  // }

  //FORM VALIDATIONS
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
    this.startTime = '10:00';
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

    if (this.endDate && !this.isDateFree(this.endDate)) {
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
  isDateFree = (d: any): boolean => {
    console.log('=== isDateFree called ===');
    console.log('Input parameter d:', d);

    let date: Date = new Date();

    // Handle Moment.js objects
    if (d && d._isAMomentObject && d._d instanceof Date) {
      console.log('📅 Input is a Moment.js object');
      date = d._d; // Extract the underlying Date object
    }
    // Handle native Date objects
    else if (d instanceof Date) {
      console.log('📅 Input is a native Date object');
      date = d;
    }
    // Handle invalid inputs
    // else {
    //   console.log('❌ DISABLED - Not a valid date object');
    //   console.log('=== End isDateFree ===\n');
    //   // return true;
    // }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log('Today date:', today.toDateString());

    // Create clean dates for comparison (ignore time)
    const cleanDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    console.log('Clean input date:', cleanDate.toDateString());

    // Disable past dates
    if (cleanDate < today) {
      console.log('❌ DISABLED - Date is in the past');
      console.log('=== End isDateFree ===\n');
      return true;
    }

    console.log('Unavailable dates array:', this.unavailableDates);
    console.log('Number of unavailable dates:', this.unavailableDates.length);

    // Check if date is in unavailable dates
    const isUnavailable = this.unavailableDates.some(
      (unavailableDate, index) => {
        if (!unavailableDate || !(unavailableDate instanceof Date)) {
          console.log(
            `Skipping unavailable date ${index + 1} - not a valid Date object`
          );
          return false;
        }

        const cleanUnavailable = new Date(
          unavailableDate.getFullYear(),
          unavailableDate.getMonth(),
          unavailableDate.getDate()
        );

        console.log(
          `Comparing: ${cleanUnavailable.toDateString()} === ${cleanDate.toDateString()}`
        );

        return cleanUnavailable.getTime() === cleanDate.getTime();
      }
    );

    console.log('Final result - isUnavailable:', isUnavailable);

    if (isUnavailable) {
      console.log('❌ DISABLED - Date is in unavailable dates');
    } else {
      console.log('✅ ENABLED - Date is available');
    }

    console.log('=== End isDateFree ===\n');
    return !isUnavailable;
  };
  // Call this separately (e.g., in ngAfterViewInit or after calendar renders)
  private styleUnavailableDates() {
    setTimeout(() => {
      this.unavailableDates.forEach((date) => {
        this.addUnavailableDateClass(date);
      });
    }, 100);
  }

  private addUnavailableDateClass(targetDate: Date) {
    const dateCells = document.querySelectorAll('.mat-calendar-body-cell');

    dateCells.forEach((cell) => {
      const ariaLabel = cell.getAttribute('aria-label');

      if (ariaLabel) {
        const parsedDate = this.parseAriaLabelDate(ariaLabel);

        if (parsedDate && this.isSameDate(parsedDate, targetDate)) {
          cell.classList.add('unavailable-date');
          console.log(
            'unavailable-date class added for',
            targetDate.toDateString()
          );
        }
      }
    });
  }

  private parseAriaLabelDate(ariaLabel: string): Date | null {
    try {
      return new Date(ariaLabel);
    } catch (error) {
      console.warn('Could not parse date from aria-label:', ariaLabel);
      return null;
    }
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
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

      this.error = '';
      this.router.navigate(['../summary'], { relativeTo: this.route });
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
    this.router.navigate(['../'], { relativeTo: this.route });
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
