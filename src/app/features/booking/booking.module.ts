import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { BookingRoutingModule } from './booking-routing.module';

import { SupersaasBookingComponent } from './supersaas-booking.component';

@NgModule({
  imports: [CommonModule, SharedModule, BookingRoutingModule,SupersaasBookingComponent],
  declarations: [],
  exports: [SupersaasBookingComponent]
})
export class BookingModule {}
