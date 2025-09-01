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
import {
  MatDatepickerModule,
  MatDateSelectionModel,
} from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
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
  ReservedDates,
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
    MatNativeDateModule,
    MatSelectModule,
  ],
  templateUrl: './date-plan-picker.component.html',
  styleUrls: ['./date-plan-picker.component.scss'],
})
export class DatePlanPickerComponent
  implements OnInit, OnChanges, AfterViewInit
{
  space!: Space;
  selectedId: string | undefined;
  plan: 'Hourly' | 'Half-day' | 'Daily' | 'Monthly' = 'Hourly';
  quantity: number = 1; // Default quantity
  date: Date | null = null;
  endDate: Date | null = null;
  startTime: number = 10;
  endTime: number = 17;
  price: number = 0;
  error: string = '';
  loading: boolean = false;
  hours: number[] = Array.from({ length: 24 }, (_, i) => i); // [0, 1, 2, ... 23]

  // --- Monthly plan support ---
  selectedMonth: Date | null = null;
  selectedDay: Date | null = null;
  constructor(
    private router: Router,
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute
  ) {}
  ngAfterViewInit(): void {
    // this.styleUnavailableDates();
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

  get minDay(): Date | null {
    if (!this.selectedMonth) return null;
    return new Date(
      this.selectedMonth.getFullYear(),
      this.selectedMonth.getMonth(),
      1
    );
  }
  get maxDay(): Date | null {
    if (!this.selectedMonth) return null;
    return new Date(
      this.selectedMonth.getFullYear(),
      this.selectedMonth.getMonth() + 1,
      0
    );
  }

  onMonthChange(month: Date | null) {
    this.selectedMonth = month;
    this.selectedDay = null;
    if (month) {
      // Set date and endDate to first and last day of month
      this.date = new Date(month.getFullYear(), month.getMonth(), 1);
      this.endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      this.calculatePrice();
    }
  }

  onDayChange(day: Date | null) {
    this.selectedDay = day;
    if (day && this.selectedMonth) {
      this.date = new Date(day);
      this.endDate = new Date(day);
      this.calculatePrice();
    }
  }

  onMonthPickerClosed() {
    // Optionally reset day selection if month changed
    if (this.selectedMonth && this.selectedDay) {
      if (
        this.selectedDay.getMonth() !== this.selectedMonth.getMonth() ||
        this.selectedDay.getFullYear() !== this.selectedMonth.getFullYear()
      ) {
        this.selectedDay = null;
      }
    }
  }

  // Add isDateFree function for date picker filtering
  isDateFree = (d: any): boolean => {
    if (!d) return false;
    let date: Date =
      d instanceof Date
        ? d
        : d._isAMomentObject && d._d instanceof Date
        ? d._d
        : new Date();
    
    // Disable past days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cleanDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    if (cleanDate < today) return false;
    
    // Disable if in unavailableDates
    const isUnavailable = this.unavailableDates.some((unavailableDate) => {
      if (!unavailableDate || !(unavailableDate instanceof Date)) return false;
      const cleanUnavailable = new Date(
        unavailableDate.getFullYear(),
        unavailableDate.getMonth(),
        unavailableDate.getDate()
      );
      return cleanUnavailable.getTime() === cleanDate.getTime();
    });
    return !isUnavailable;
  };

  // Add isHourAvailable function for time selection
  isHourAvailable(hour: number): boolean {
    if (!this.date) return false;
    // Create date objects for the selected date with the given hour
    const startDateTime = new Date(this.date);
    startDateTime.setHours(hour, 0, 0, 0);
    const endDateTime = new Date(this.date);
    endDateTime.setHours(hour + 1, 0, 0, 0);

    const available = SpaceAvailabilityUtils.isSpaceAvailable(
      this.space,
      startDateTime,
      endDateTime,
      this.quantity 
    );

    const hourIsAfter = startDateTime > new Date();
    const hourIsAfterStart = startDateTime >= new Date(this.getStartDateTime());
    return available && hourIsAfter && hourIsAfterStart;
    // Check if this hour is available based on space availability
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
    this.startTime = 10;
    this.endTime = 17;
    this.price = 0;
    this.error = '';
    this.selectedMonth = null;
    this.selectedDay = null;
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
      // const [startHours, startMinutes] = this.startTime.split(':').map(Number);
      // const [endHours, endMinutes] = this.endTime.split(':').map(Number);
      const startHours = this.startTime;
      const endHours = this.endTime;

      const startTotal = startHours * 60;
      const endTotal = endHours * 60;

      if (endTotal <= startTotal) {
        this.error = 'End time must be after start time';
      } else {
        this.error = '';
      }
    }
  }

  // Add this method to handle quantity changes
  onQuantityChange() {
    if (this.quantity < 1) this.quantity = 1;
    if (this.space.capacity && this.quantity > this.space.capacity) {
      this.quantity = this.space.capacity;
    }
    this.validateAvailability();
    this.calculatePrice();
  }

  // Update validateAvailability to check against quantity and capacity
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
        this.getEndDateTime(),
        this.quantity // Pass quantity to availability check
      );

      if (!isAvailable) {
        if (this.quantity > 1) {
          this.error = `Not enough units available for the selected period. Please reduce quantity or choose different dates.`;
        } else {
          this.error = 'Selected period is not available';
        }
      } else {
        this.error = '';
      }
    }
  }

  // Update calculatePrice to multiply by quantity
  calculatePrice() {
    if (!this.date || !this.space) {
      this.price = 0;
      return;
    }

    let basePrice = 0;

    if (this.isHourly && this.startTime !== undefined && this.endTime !== undefined) {
      const hours = this.endTime - this.startTime;
      basePrice = hours * this.space.pricing.hourly;
    } else if (this.isHalfDay) { // Add Half-day pricing
      basePrice = this.space.pricing.halfDay;
    } else if (this.isDaily) {
      if (this.endDate) {
        const days = this.getDaysBetween(this.date, this.endDate) + 1;
        basePrice = days * this.space.pricing.day;
      } else {
        basePrice = this.space.pricing.day;
      }
    } else if (this.isMonthly) {
      basePrice = this.space.pricing.lite || 0;
    }

    // Multiply by quantity
    this.price = basePrice * this.quantity;
  }

  // Add getter for Half-day plan
  get isHalfDay(): boolean {
    return this.plan === 'Half-day';
  }

  // Update next method to include quantity in booking details
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
      
      // Set the quantity in booking service
      this.bookingService.setSelection({ reservedUnits: this.quantity });

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

  // Update validateBookingPeriod to check against quantity
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

    // Check if the selected period is available with the requested quantity
    const isAvailable = SpaceAvailabilityUtils.isSpaceAvailable(
      this.space,
      startDateTime,
      endDateTime,
      this.quantity // Pass quantity to availability check
    );

    if (!isAvailable) {
      this.snackBar.open(
        this.quantity > 1 
          ? `Not enough units available for the selected period. Please reduce quantity or choose different dates.`
          : 'The selected period is not available. Please choose different dates/times.',
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

  // Helper method to calculate days between two dates
  private getDaysBetween(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  back(){
    this.router.navigate(['../'], { relativeTo: this.route });
  }
   getStartDateTime(): Date {
    if (!this.date) return new Date();

    const date = new Date(this.date);
    if (this.isHourly && this.startTime) {
      date.setHours(this.startTime, 0, 0, 0);
    } else {
      date.setHours(9, 0, 0, 0); 
    }
    return date;
  }

  getEndDateTime(): Date {
    let endDate = this.endDate || this.date;
    if (!endDate) return new Date();

    const date = new Date(endDate);
    if (this.isHourly && this.endTime) {
      date.setHours(this.endTime, 0, 0, 0);
    } else {
      date.setHours(17, 0, 0, 0); // Default to 5 PM
    }
    return date;
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
