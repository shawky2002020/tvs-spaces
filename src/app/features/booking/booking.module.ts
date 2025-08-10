import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { BookingRoutingModule } from './booking-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, BookingRoutingModule],
  declarations: [],
  exports: []
})
export class BookingModule {}
